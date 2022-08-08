import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';

const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.BalanceFetcher(OPENLEVERAGE_DEFINITION.id, network)
export class BinanceSmartChainOpenleverageBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: OPENLEVERAGE_DEFINITION.id,
      groupId: OPENLEVERAGE_DEFINITION.groups.pool.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances] = await Promise.all([this.getPoolTokenBalances(address)]);
    return presentBalanceFetcherResponse([
      {
        label: 'Pool',
        assets: poolTokenBalances,
      },
    ]);
  }
}
