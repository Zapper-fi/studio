import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronBalanceHelper } from '../helpers/abracadabra.cauldron.balance-helper';

const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.BalanceFetcher(ABRACADABRA_DEFINITION.id, network)
export class BinanceSmartChainAbracadabraBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(AbracadabraCauldronBalanceHelper)
    private readonly abracadabraCauldronBalanceHelper: AbracadabraCauldronBalanceHelper,
  ) {}

  private async getCauldronBalances(address: string) {
    return this.abracadabraCauldronBalanceHelper.getBalances({ address, network });
  }

  async getBalances(address: string) {
    const [cauldronBalances] = await Promise.all([this.getCauldronBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Cauldrons',
        assets: cauldronBalances,
      },
    ]);
  }
}
