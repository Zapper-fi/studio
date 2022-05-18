import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { IMPERMAX_DEFINITION } from '../impermax.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(IMPERMAX_DEFINITION.id, network)
export class PolygonImpermaxBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getLendingBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: IMPERMAX_DEFINITION.id,
      groupId: IMPERMAX_DEFINITION.groups.lend.id,
      network,
    });
  }

  async getBalances(address: string) {
    const lendingBalance = await this.getLendingBalances(address);

    // TODO: fetch debt in borrow position

    return presentBalanceFetcherResponse([
      {
        label: 'Lend',
        assets: lendingBalance,
      },
    ]);
  }
}
