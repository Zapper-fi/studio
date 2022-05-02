import { Inject } from '@nestjs/common';

import { TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import ALPHA_V1_DEFINITION from '../alpha-v1.definition';

const appId = ALPHA_V1_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumAlphaV1BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper) {}

  private async getLendingTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: ALPHA_V1_DEFINITION.groups.lending.id,
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
