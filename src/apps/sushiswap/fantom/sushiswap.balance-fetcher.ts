import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { TokenBalanceHelper } from '~app-toolkit/helpers/balance/token-balance.helper';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SUSHISWAP_DEFINITION } from '../sushiswap.definition';

const appId = SUSHISWAP_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(appId, network)
export class FantomSushiswapBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper) {}

  private async getPoolTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: SUSHISWAP_DEFINITION.groups.pool.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances] = await Promise.all([this.getPoolTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
    ]);
  }
}
