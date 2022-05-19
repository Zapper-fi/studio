import { Inject } from '@nestjs/common';
import { TokenBalanceHelper } from '~app-toolkit';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { STURDY_DEFINITION } from '../sturdy.definition';

const network = Network.FANTOM_OPERA_MAINNET;
const appId = STURDY_DEFINITION.id;

@Register.BalanceFetcher(STURDY_DEFINITION.id, network)
export class FantomSturdyBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper) { }

  private async getLendingTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: STURDY_DEFINITION.groups.lending.id,
      network,
    });
  }
  async getBalances(address: string) {
    const [lendingTokenBalances] = await Promise.all([this.getLendingTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: lendingTokenBalances,
      },
    ]);
  }
}
