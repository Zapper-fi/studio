import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(AELIN_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumAelinBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: AELIN_DEFINITION.id,
      groupId: AELIN_DEFINITION.groups.pool.id,
      address,
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
