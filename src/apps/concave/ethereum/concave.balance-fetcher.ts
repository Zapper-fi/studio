import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { WithMetaType } from '~position/display.interface';
import { BaseTokenBalance, ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { supplied, claimable } from '~position/position.utils';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { CONCAVE_DEFINITION } from '../concave.definition';
import { ConcaveContractFactory } from '../contracts';
import { getuserPositions } from '../helpers/getUserPositions';

import { ConcaveLsdcnvContractPositionDataProps } from './concave.lsdcnv.contract-position-fetcher';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(CONCAVE_DEFINITION.id, network)
export class EthereumConcaveBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcaveContractFactory) private readonly concaveContractFactory: ConcaveContractFactory,
  ) {}

  async getPositions(address: string) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const cnvToken = baseTokens.find(token => token.symbol === 'CNV') as BaseToken;
    const rawPositions = await getuserPositions();
    const proxyAddress = '0x93c3a816242e50ea8871a29bf62cc3df58787fbd';
    const tokens = [supplied(cnvToken), claimable(cnvToken)];
    const label = 'LSDCNV';
    const images = [...getImagesFromToken(cnvToken)];
    const userPositions = rawPositions
      .filter(position => position.to.toLowerCase() === address.toLowerCase())
      .map(position => {
        {
          const returnPosition: ContractPosition<ConcaveLsdcnvContractPositionDataProps> = {
            type: ContractType.POSITION,
            address: proxyAddress,
            appId: CONCAVE_DEFINITION.id,
            groupId: CONCAVE_DEFINITION.groups.lsdcnv.id,
            network,
            tokens,
            dataProps: {
              owner: position.to.toLowerCase(),
              poolID: position.poolID,
              deposit: position.deposit,
              tokenId: position.positionID,
              unlockTime: new Date(position.maturity * 1000),
            },
            displayProps: {
              label,
              images,
            },
          };
          return returnPosition;
        }
      });
    return userPositions;
  }
  async getBalances(address: string) {
    const proxyAddress = '0x93c3a816242e50ea8871a29bf62cc3df58787fbd';
    const contract = this.concaveContractFactory.lsdcnv({ address: proxyAddress, network });
    const balances: ContractPosition<ConcaveLsdcnvContractPositionDataProps>[] = await this.getPositions(address);

    const finalBalances = await Promise.all(
      balances.map(async position => {
        const { totalRewards } = await contract.viewPositionRewards(position.dataProps.tokenId);
        const stakedToken = position.tokens.find(token => token.symbol === 'CNV') as BaseToken;
        const rewardToken = position.tokens.find(token => token.symbol === 'CNV') as BaseToken;
        const tokens: WithMetaType<BaseTokenBalance>[] = [];
        if (stakedToken) {
          stakedToken.network = network;
          tokens.push(drillBalance(supplied(stakedToken), position.dataProps.deposit));
        }
        if (rewardToken) {
          rewardToken.network = network;
          const finalToken = drillBalance(claimable(rewardToken), totalRewards.toString());
          finalToken.metaType = 'claimable' as MetaType;
          tokens.push(finalToken);
        }
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const finalPosition: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: proxyAddress,
          appId: CONCAVE_DEFINITION.id,
          groupId: CONCAVE_DEFINITION.groups.lsdcnv.id,
          network,
          tokens,
          balanceUSD,
          dataProps: {
            owner: position.dataProps.owner,
            poolID: position.dataProps.poolID,
            deposit: position.dataProps.deposit,
            tokenId: position.dataProps.tokenId,
            unlockTime: position.dataProps.unlockTime,
          },
          displayProps: {
            label: position.displayProps.label,
            images: position.displayProps.images,
          },
        };

        return finalPosition;
      }),
    );

    return presentBalanceFetcherResponse([{ label: 'LSDCNV Positions', assets: finalBalances }]);
  }
}
