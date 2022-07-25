import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BISWAP_DEFINITION } from '../biswap.definition';

const appId = BISWAP_DEFINITION.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.BalanceFetcher(appId, network)
export class BinanceSmartChainBiswapBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: BISWAP_DEFINITION.groups.pool.id,
    });
  }

  async getBalances(address: string) {
    const [poolBalances] = await Promise.all([this.getPoolBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
    ]);
  }
}
