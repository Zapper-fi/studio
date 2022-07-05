import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SushiSwapBentoBoxContractPositionBalanceHelper } from '~apps/sushiswap-bentobox';
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
    @Inject(SushiSwapBentoBoxContractPositionBalanceHelper)
    private readonly degenboxBalanceHelper: SushiSwapBentoBoxContractPositionBalanceHelper,
  ) {}

  private async getDegenboxBalances(address: string) {
    return this.degenboxBalanceHelper.getBalances({
      address,
      network,
      bentoBoxAddress: '0x090185f2135308bad17527004364ebcc2d37e5f6',
    });
  }

  private async getCauldronBalances(address: string) {
    return this.abracadabraCauldronBalanceHelper.getBalances({ address, network });
  }

  async getBalances(address: string) {
    const [cauldronBalances, degenboxBalances] = await Promise.all([
      this.getCauldronBalances(address),
      this.getDegenboxBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Cauldrons',
        assets: cauldronBalances,
      },
      {
        label: 'Abracadabra Degenbox',
        assets: degenboxBalances,
      },
    ]);
  }
}
