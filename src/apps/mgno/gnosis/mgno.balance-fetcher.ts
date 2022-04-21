import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MGNO_DEFINITION } from '../mgno.definition';

const network = Network.GNOSIS_MAINNET;

@Register.BalanceFetcher(MGNO_DEFINITION.id, network)
export class GnosisMgnoBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    return presentBalanceFetcherResponse([]);
  }
}
