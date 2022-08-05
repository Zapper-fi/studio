import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SUPERFLUID_DEFINITION } from '../superfluid.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(SUPERFLUID_DEFINITION.id, network)
export class PolygonSuperfluidBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    const balances = await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: SUPERFLUID_DEFINITION.id,
      groupId: SUPERFLUID_DEFINITION.groups.vault.id,
      address,
    });

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: balances,
      },
    ]);
  }
}
