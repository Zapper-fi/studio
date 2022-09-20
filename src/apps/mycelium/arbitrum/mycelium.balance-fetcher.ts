import { Inject } from '@nestjs/common';

import { TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MyceliumLevTradesBalanceHelper } from '../helpers/mycelium.lev-trades.balance-helper';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(MYCELIUM_DEFINITION.id, network)
export class ArbitrumMyceliumBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(MyceliumLevTradesBalanceHelper) private readonly levTradesBalanceHelper: MyceliumLevTradesBalanceHelper,
  ) {}

  private async getEsMycTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId: MYCELIUM_DEFINITION.id,
      groupId: MYCELIUM_DEFINITION.groups.esMyc.id,
      network,
    });
  }

  private async getMlpTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId: MYCELIUM_DEFINITION.id,
      groupId: MYCELIUM_DEFINITION.groups.mlp.id,
      network,
    });
  }

  private async getLevTradesPositions(address: string) {
    return this.levTradesBalanceHelper.getBalance({ address, network });
  }

  async getBalances(address: string) {
    const [mlpTokenBalances, esMycTokenBalances, levTradesPositions] = await Promise.all([
      this.getMlpTokenBalances(address),
      this.getEsMycTokenBalances(address),
      this.getLevTradesPositions(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'MLP',
        assets: [...mlpTokenBalances],
      },
      {
        label: 'esMYC',
        assets: [...esMycTokenBalances],
      },
      {
        label: 'Leveraged trades',
        assets: [...levTradesPositions],
      },
    ]);
  }
}
