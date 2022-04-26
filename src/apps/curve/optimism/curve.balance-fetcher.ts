import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveGaugeV2, CurveNGauge } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

@Register.BalanceFetcher(CURVE_DEFINITION.id, Network.OPTIMISM_MAINNET)
export class OptimismCurveBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.OPTIMISM_MAINNET,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.pool.id,
      address,
    });
  }

  private async getStakedBalances(address: string) {
    return Promise.all([
      // Single Gauge
      this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveGaugeV2>({
        address,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.farm.id,
        network: Network.OPTIMISM_MAINNET,
        resolveContract: ({ address, network }) => this.curveContractFactory.curveGaugeV2({ address, network }),
        resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
        resolveRewardTokenBalances: ({ contract, address, multicall, contractPosition }) => {
          const rewardTokens = contractPosition.tokens.filter(isClaimable);
          const wrappedContract = multicall.wrap(contract);
          return Promise.all(rewardTokens.map(v => wrappedContract.claimable_reward_write(address, v.address)));
        },
      }),
      // N-Gauge
      this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveNGauge>({
        address,
        network: Network.OPTIMISM_MAINNET,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.farm.id,
        farmFilter: farm => farm.dataProps.implementation === 'n-gauge',
        resolveContract: ({ address, network }) => this.curveContractFactory.curveNGauge({ address, network }),
        resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
        resolveRewardTokenBalances: async ({ contract, address, multicall, contractPosition }) => {
          const rewardTokens = contractPosition.tokens.filter(isClaimable);
          const wrappedContract = multicall.wrap(contract);
          const primaryRewardBalance = await wrappedContract.claimable_tokens(address);
          const rewardBalances = [primaryRewardBalance];

          if (rewardTokens.length > 1) {
            const secondaryRewardBalance = await wrappedContract.claimable_reward(address, rewardTokens[1].address);
            rewardBalances.push(secondaryRewardBalance);
          }

          return rewardBalances;
        },
      }),
    ]).then(v => v.flat());
  }

  async getBalances(address: string) {
    const [poolTokenBalances, stakedBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Staked',
        assets: stakedBalances,
      },
    ]);
  }
}
