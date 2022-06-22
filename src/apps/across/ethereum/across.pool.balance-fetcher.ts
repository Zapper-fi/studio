import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import ACROSS_DEFINITION from '../across.definition';

const appId = ACROSS_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumAcrossBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: ACROSS_DEFINITION.id,
      groupId: ACROSS_DEFINITION.groups.pool.id,
      address,
    });
  }

  async getBalances(address: string) {
    const balances = await this.getPoolTokenBalances(address);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: balances,
      },
    ]);
  }
}
