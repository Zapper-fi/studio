import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SushiSwapBentoBoxContractPositionBalanceHelper } from '../helpers/sushiswap-bentobox.vault.contract-position-balance-helper';
import { SUSHISWAP_BENTOBOX_DEFINITION } from '../sushiswap-bentobox.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(SUSHISWAP_BENTOBOX_DEFINITION.id, network)
export class PolygonSushiSwapBentoBoxBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SushiSwapBentoBoxContractPositionBalanceHelper)
    private readonly balanceHelper: SushiSwapBentoBoxContractPositionBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const balances = await this.balanceHelper.getBalances({
      address,
      network,
      bentoBoxAddress: '0x0319000133d3ada02600f0875d2cf03d442c3367',
    });

    return presentBalanceFetcherResponse([
      {
        label: 'SushiSwap BentoBox',
        assets: balances,
      },
    ]);
  }
}
