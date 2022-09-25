import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { YIELDYAK_DEFINITION } from '../yieldyak.definition';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(YIELDYAK_DEFINITION.id, network)
export class AvalancheYieldyakBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getYRTBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YIELDYAK_DEFINITION.id,
      groupId: YIELDYAK_DEFINITION.groups.farms.id,
      network: Network.AVALANCHE_MAINNET,
    });
  }

  async getBalances(address: string) {
    return presentBalanceFetcherResponse([
      {
        label: 'Farms',
        assets: await this.getYRTBalances(address),
      },
    ]);
  }
}
