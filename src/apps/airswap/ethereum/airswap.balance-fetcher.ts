import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AIRSWAP_DEFINITION } from '../airswap.definition';
import { AirswapContractFactory } from '~apps/airswap/contracts';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(AIRSWAP_DEFINITION.id, network)
export class EthereumAirswapBalanceFetcher implements BalanceFetcher {
  constructor(
      @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
      @Inject(AirswapContractFactory) private readonly airswapContractFactory: AirswapContractFactory,
  ) {}

  async getBalances(address: string) {
    const contract = this.airswapContractFactory.staking({ address, network })

    return presentBalanceFetcherResponse([]);
  }
}
