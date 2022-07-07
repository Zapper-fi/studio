import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ATLENDIS_V_1_DEFINITION } from '../atlendis-v1.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(ATLENDIS_V_1_DEFINITION.id, network)
export class PolygonAtlendisV1BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositionBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances();
  }

  async getBalances(address: string) {
    return presentBalanceFetcherResponse([]);
  }
}
