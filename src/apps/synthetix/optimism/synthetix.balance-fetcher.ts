import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~app/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SynthetixMintrBalanceHelper } from '../helpers/synthetix.mintr.balance-helper';
import { SynthetixSynthBalanceHelper } from '../helpers/synthetix.synth.balance-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.BalanceFetcher(SYNTHETIX_DEFINITION.id, Network.OPTIMISM_MAINNET)
export class OptimismSynthetixBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SynthetixSynthBalanceHelper)
    private readonly synthetixSynthBalanceHelper: SynthetixSynthBalanceHelper,
    @Inject(SynthetixMintrBalanceHelper)
    private readonly synthetixMintrBalanceHelper: SynthetixMintrBalanceHelper,
  ) {}

  private async getSynthTokenBalances(address: string) {
    return this.synthetixSynthBalanceHelper.getSynthBalances({
      address,
      network: Network.OPTIMISM_MAINNET,
      resolverAddress: '0x95a6a3f44a70172e7d50a9e28c85dfd712756b8c',
    });
  }

  private async getMintrBalance(address: string) {
    return this.synthetixMintrBalanceHelper.getBalances({
      address,
      network: Network.OPTIMISM_MAINNET,
      resolverAddress: '0x95a6a3f44a70172e7d50a9e28c85dfd712756b8c',
    });
  }

  async getBalances(address: string) {
    const [synthBalances, mintrBalance] = await Promise.all([
      this.getSynthTokenBalances(address),
      this.getMintrBalance(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Synths',
        assets: [...synthBalances],
      },
      {
        label: 'Mintr',
        assets: mintrBalance.assets,
        meta: mintrBalance.meta,
      },
    ]);
  }
}
