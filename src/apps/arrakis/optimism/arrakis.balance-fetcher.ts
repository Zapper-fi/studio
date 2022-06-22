import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ARRAKIS_DEFINITION } from '../arrakis.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(ARRAKIS_DEFINITION.id, Network.OPTIMISM_MAINNET)
export class OptimismArrakisBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ARRAKIS_DEFINITION.id,
      groupId: ARRAKIS_DEFINITION.groups.pool.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances] = await Promise.all([this.getPoolTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
    ]);
  }
}
