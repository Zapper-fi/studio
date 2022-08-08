import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { FURUCOMBO_DEFINITION } from '../furucombo.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(FURUCOMBO_DEFINITION.id, network)
export class PolygonFurucomboBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getFundShareTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: FURUCOMBO_DEFINITION.id,
      groupId: FURUCOMBO_DEFINITION.groups.fund.id,
      network: Network.POLYGON_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [fundShareTokenBalances] = await Promise.all([this.getFundShareTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Funds',
        assets: fundShareTokenBalances,
      },
    ]);
  }
}
