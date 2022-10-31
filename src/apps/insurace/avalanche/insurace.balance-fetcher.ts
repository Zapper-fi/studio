import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { INSURACE_DEFINITION } from '../insurace.definition';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(INSURACE_DEFINITION.id, network)
export class AvalancheInsuraceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    const assets = await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: INSURACE_DEFINITION.id,
      groupId: INSURACE_DEFINITION.groups.mining.id,
      network,
    });

    return presentBalanceFetcherResponse([
      {
        label: 'Mining',
        assets,
      },
    ]);
  }
}
