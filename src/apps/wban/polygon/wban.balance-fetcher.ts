import { Inject } from '@nestjs/common';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { WbanFarmBalanceFetcherHelper } from '../helpers/wban.farm.balance-fetcher-helper';
import { WBAN_DEFINITION } from '../wban.definition';

const appId = WBAN_DEFINITION.id;
const groupId = WBAN_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(WBAN_DEFINITION.id, network)
export class PolygonWbanBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(WbanFarmBalanceFetcherHelper) private readonly helper: WbanFarmBalanceFetcherHelper) {}

  async getBalances(address: string) {
    const farmBalances = await this.helper.getFarmBalances(network, appId, groupId, address);
    return presentBalanceFetcherResponse([
      {
        label: 'Farms',
        assets: farmBalances,
      },
    ]);
  }

}
