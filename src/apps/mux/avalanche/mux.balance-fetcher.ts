import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { MuxLevTradesBalanceHelper } from '~apps/mux/helpers/mux.lev-trades.balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MUX_DEFINITION } from '../mux.definition';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(MUX_DEFINITION.id, network)
export class AvalancheMuxBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxLevTradesBalanceHelper) private readonly muxLevTradesBalanceHelper: MuxLevTradesBalanceHelper,
  ) {}

  private async getLevTradesBalances(address: string) {
    return this.muxLevTradesBalanceHelper.getBalance({ address, network });
  }

  async getBalances(address: string) {
    const levTradesBalances = await this.getLevTradesBalances(address);

    return presentBalanceFetcherResponse([
      {
        label: 'Leveraged trades',
        assets: [...levTradesBalances],
      },
    ]);
  }
}
