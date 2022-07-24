import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SushiSwapKashiLendingBalanceHelper } from '../helpers/sushiswap-kashi.lending.balance-helper';
import { SUSHISWAP_KASHI_DEFINITION } from '../sushiswap-kashi.definition';

const appId = SUSHISWAP_KASHI_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumSushiswapKashiBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SushiSwapKashiLendingBalanceHelper)
    private readonly sushiSwapKashiLendingBalanceHelper: SushiSwapKashiLendingBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const balances = await this.sushiSwapKashiLendingBalanceHelper.getBalances({
      network,
      address,
    });

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: balances,
      },
    ]);
  }
}
