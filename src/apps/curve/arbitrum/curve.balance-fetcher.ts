import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CurveChildLiquidityGauge, CurveContractFactory } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(CURVE_DEFINITION.id, Network.ARBITRUM_MAINNET)
export class ArbitrumCurveBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.pool.id,
      address,
    });
  }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveChildLiquidityGauge>({
      address,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.gauge.id,
      network,
      resolveContract: ({ address, network }) =>
        this.curveContractFactory.curveChildLiquidityGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: async ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const otherRewardTokens = rewardTokens.filter(v => v.symbol !== 'CRV');

        return Promise.all([
          multicall.wrap(contract).callStatic.claimable_tokens(address),
          ...otherRewardTokens.map(v => multicall.wrap(contract).claimable_reward(address, v.address)),
        ]);
      },
    });
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
