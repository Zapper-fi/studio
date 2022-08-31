import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SushiSwapBentoBoxContractPositionBalanceHelper } from '../helpers/sushiswap-bentobox.vault.contract-position-balance-helper';
import { SUSHISWAP_BENTOBOX_DEFINITION } from '../sushiswap-bentobox.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(SUSHISWAP_BENTOBOX_DEFINITION.id, network)
export class ArbitrumSushiSwapBentoBoxBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SushiSwapBentoBoxContractPositionBalanceHelper)
    private readonly balanceHelper: SushiSwapBentoBoxContractPositionBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const balances = await this.balanceHelper.getBalances({
      address,
      network,
      bentoBoxAddress: '0x74c764d41b77dbbb4fe771dab1939b00b146894a',
    });

    return presentBalanceFetcherResponse([
      {
        label: 'SushiSwap BentoBox',
        assets: balances,
      },
    ]);
  }
}
