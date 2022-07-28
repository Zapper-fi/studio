import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveGaugeDefaultContractPositionBalanceHelper } from '../helpers/curve.gauge.default.contract-position-balance-helper';

const network = Network.HARMONY_MAINNET;

@Register.BalanceFetcher(CURVE_DEFINITION.id, Network.HARMONY_MAINNET)
export class HarmonyCurveBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveGaugeDefaultContractPositionBalanceHelper)
    private readonly curveGaugeDefaultContractPositionBalanceHelper: CurveGaugeDefaultContractPositionBalanceHelper,
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
    return this.curveGaugeDefaultContractPositionBalanceHelper.getPositions({
      address,
      network,
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
