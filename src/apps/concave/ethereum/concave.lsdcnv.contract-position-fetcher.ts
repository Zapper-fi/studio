import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { CONCAVE_DEFINITION } from '../concave.definition';
import { ConcaveContractFactory } from '../contracts';
import { getPoolNameFromID } from '../helpers/getPoolID';
import { getuserPositions } from '../helpers/getUserPositions';

const appId = CONCAVE_DEFINITION.id;
const groupId = CONCAVE_DEFINITION.groups.lsdcnv.id;
const network = Network.ETHEREUM_MAINNET;

export type ConcaveLsdcnvContractPositionDataProps = {
  totalRewardsUSD?: number;
  stakedUSD?: number;
  poolID: string | undefined;
  deposit: string;
  owner: string;
  unlockTime: Date;
  tokenId: number;
};
@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumConcaveLsdcnvContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcaveContractFactory) private readonly concaveContractFactory: ConcaveContractFactory,
  ) {}
  // Erroring ATM
  // @CacheOnInterval({
  //   // key: `apps-v3:${network}:${appId}:${groupId}:definitions`,
  //   key: `studio:${network}:${appId}:${groupId}:vaults`,
  //   // key: `studio:${CONCAVE_DEFINITION.id}:lsdcnv-addresses`,
  //   timeout: 15 * 60 * 1000,
  // })
  async getPositionDefinitions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const cnvToken = baseTokens.find(token => token.symbol === 'CNV') as BaseToken;
    const proxyAddress = '0x93c3a816242e50ea8871a29bf62cc3df58787fbd';
    const label = 'LSDCNV';
    const images = [...getImagesFromToken(cnvToken)];

    const tokens = [supplied(cnvToken), claimable(cnvToken)];
    const rawPositions = await getuserPositions();
    const positions = await Promise.all(
      rawPositions.map(async position => {
        const returnPosition: ContractPosition<ConcaveLsdcnvContractPositionDataProps> = {
          type: ContractType.POSITION,
          address: proxyAddress,
          appId: CONCAVE_DEFINITION.id,
          groupId: CONCAVE_DEFINITION.groups.lsdcnv.id,
          network,
          tokens,
          dataProps: {
            owner: position.to.toLowerCase(),
            poolID: getPoolNameFromID(position.poolID),
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
      }),
    );
    return positions;
  }

  async getPositions(): Promise<any> {
    const positions = await this.getPositionDefinitions();
    return positions;
  }
}
