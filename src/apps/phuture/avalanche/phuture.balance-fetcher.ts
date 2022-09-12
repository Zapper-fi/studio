import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PHUTURE_DEFINITION } from '../phuture.definition';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(PHUTURE_DEFINITION.id, network)
export class AvalanchePhutureBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getIndexTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: PHUTURE_DEFINITION.id,
      groupId: PHUTURE_DEFINITION.groups.index.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [indexTokenBalances] = await Promise.all([this.getIndexTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Indexes',
        assets: indexTokenBalances,
      },
    ]);
  }
}
