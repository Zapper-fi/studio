import { Inject } from '@nestjs/common';
import { range, sum } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CurvePoolTokenDataProps } from '~apps/curve/helpers/curve.pool.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VelodromeContractFactory, VelodromeGauge } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

const appId = VELODROME_DEFINITION.id;
const groupId = VELODROME_DEFINITION.groups.farm.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismVelodromeStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) private readonly contractFactory: VelodromeContractFactory,
  ) {}

  async getPositions() {
    const poolTokens = await this.appToolkit.getAppTokenPositions<CurvePoolTokenDataProps>({
      appId,
      groupIds: [VELODROME_DEFINITION.groups.pool.id],
      network,
    });
    const positions =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<VelodromeGauge>({
        network,
        appId,
        groupId,
        dependencies: [{ appId, groupIds: [VELODROME_DEFINITION.groups.pool.id], network }],
        resolveFarmAddresses: async () => poolTokens.map(t => t.dataProps.gaugeAddresses).flat(),
        resolveLiquidity: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
        resolveFarmContract: ({ address, network }) => this.contractFactory.velodromeGauge({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).stake(),
        resolveRewardTokenAddresses: async ({ contract, multicall }) => {
          const numRewards = Number(await multicall.wrap(contract).rewardsListLength());
          return Promise.all(range(numRewards).map(async n => await multicall.wrap(contract).rewards(n)));
        },
        resolveIsActive: async ({ contract, multicall, rewardTokens }) => {
          const rates = await Promise.all(
            rewardTokens.map(async token => await multicall.wrap(contract).rewardRate(token.address)),
          );
          return sum(rates.map(Number)) > 0;
        },
        resolveRois: async ({ contract, multicall, rewardTokens, stakedToken }) => {
          const baseROI = sum(
            await Promise.all(
              rewardTokens.map(async token => {
                const rewardRate = await multicall.wrap(contract).rewardPerToken(token.address);
                return (Number(rewardRate) * token.price) / stakedToken.price;
              }),
            ),
          );
          return {
            dailyROI: baseROI * 86400,
            weeklyROI: baseROI * 604800,
            yearlyROI: baseROI * 31536000,
          };
        },
      });
    return positions;
  }
}
