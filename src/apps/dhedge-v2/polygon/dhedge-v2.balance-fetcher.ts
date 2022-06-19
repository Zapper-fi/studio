import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';

const appId = DHEDGE_V_2_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(DHEDGE_V_2_DEFINITION.id, network)
export class PolygonDhedgeV2BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokenBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: DHEDGE_V_2_DEFINITION.groups.pool.id,
      network,
    });
  }

  async getBalances(address: string) {
    const assets = await this.getTokenBalances(address);
    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets,
      },
    ]);
  }
}
