import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import { OLYMPUS_DEFINITION } from '../olympus.definition';

@Register.BalanceFetcher(OLYMPUS_DEFINITION.id, Network.AVALANCHE_MAINNET)
export class AvalancheOlympusBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    const appId = OLYMPUS_DEFINITION.id;
    const network = Network.AVALANCHE_MAINNET;
    const groupIds = [OLYMPUS_DEFINITION.groups.gOhm, OLYMPUS_DEFINITION.groups.wsOhmV1];

    const assets = await Promise.all(
      groupIds.map(groupId =>
        this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
          network,
          appId,
          groupId,
          address,
        }),
      ),
    ).then(v => v.flat());

    return presentBalanceFetcherResponse([{ label: 'Staked', assets }]);
  }
}
