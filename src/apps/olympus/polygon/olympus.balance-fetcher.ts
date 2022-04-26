import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import { OLYMPUS_DEFINITION } from '../olympus.definition';

@Register.BalanceFetcher(OLYMPUS_DEFINITION.id, Network.POLYGON_MAINNET)
export class PolygonOlympusBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    const network = Network.POLYGON_MAINNET;
    const assets = await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId: OLYMPUS_DEFINITION.id,
      groupId: OLYMPUS_DEFINITION.groups.gOhm.id,
      network,
      address,
    });

    return presentBalanceFetcherResponse([{ label: 'Staked', assets }]);
  }
}
