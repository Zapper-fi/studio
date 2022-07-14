import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { TRISOLARIS_DEFINITION } from '~apps/trisolaris/trisolaris.definition';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { VAPORWAVE_FINANCE_DEFINITION } from '../vaporwave-finance.definition';

import auroraStakePools from './vaporwave-finance.stake.config';

const appId = VAPORWAVE_FINANCE_DEFINITION.id;
const groupId = VAPORWAVE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.AURORA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraVaporwaveFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: TRISOLARIS_DEFINITION.id,
      groupIds: [TRISOLARIS_DEFINITION.groups.pool.id],
      network,
    });

    const allTokens = [...appTokens, ...baseTokens];
    const positions = await Promise.all(
      auroraStakePools.map(async ({ earnContractAddress, earnedTokenAddress, tokenAddress, token, earnedOracleId }) => {
        const stakedToken = allTokens.find(v => v.address === tokenAddress || v.symbol === token);
        const earnedToken = allTokens.find(v => v.address === earnedTokenAddress || v.symbol === earnedOracleId);
        if (!stakedToken || !earnedToken) return null;

        const tokens = [supplied(stakedToken), claimable(earnedToken)];
        const stakedTokenContract = this.appToolkit.globalContracts.erc20({ address: tokenAddress, network });
        const [balanceRaw] = await Promise.all([multicall.wrap(stakedTokenContract).balanceOf(earnContractAddress)]);
        const liquidity = Number(balanceRaw) / 10 ** stakedToken.decimals;

        const label = getLabelFromToken(stakedToken);
        const images = getImagesFromToken(stakedToken);

        // Create the contract position object
        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: earnContractAddress,
          network,
          tokens,
          dataProps: {
            liquidity,
          },
          displayProps: {
            label,
            images,
          },
        };

        return position;
      }),
    );

    return _.compact(positions);
  }
}
