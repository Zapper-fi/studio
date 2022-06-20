import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ACROSS_V2_DEFINITION } from '../across-v2.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(ACROSS_V2_DEFINITION.id, network)
export class BobaAcrossV2BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: ACROSS_V2_DEFINITION.id,
      groupId: ACROSS_V2_DEFINITION.groups.pool.id,
      address,
    });
  }

  async getBalances(address: string) {
     const balances = await this.getPoolTokenBalances(address);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: balances,
      },
    ]);
  }
}
