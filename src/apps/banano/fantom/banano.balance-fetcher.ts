import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BANANO_DEFINITION } from '../banano.definition';
import { BananoFarmBalanceFetcherHelper } from '../helpers/banano.farm.balance-fetcher-helper';

const appId = BANANO_DEFINITION.id;
const groupId = BANANO_DEFINITION.groups.farm.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(BANANO_DEFINITION.id, network)
export class FantomBananoBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(BananoFarmBalanceFetcherHelper) private readonly helper: BananoFarmBalanceFetcherHelper) {}

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
