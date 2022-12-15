import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PENDLE_V_2_DEFINITION } from '../pendle-v2.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(PENDLE_V_2_DEFINITION.id, network)
export class EthereumPendleV2BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async fetchBalanceInGroup(address: string, groupId: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: PENDLE_V_2_DEFINITION.id,
      network,
      groupId: groupId,
    });
  }
  async getBalances(address: string) {
    const [ptBalances, ytBalances, syBalances, lpBalances] = await Promise.all([
      this.fetchBalanceInGroup(address, PENDLE_V_2_DEFINITION.groups.principalToken.label),
      this.fetchBalanceInGroup(address, PENDLE_V_2_DEFINITION.groups.yieldToken.label),
      this.fetchBalanceInGroup(address, PENDLE_V_2_DEFINITION.groups.standardizedYieldToken.label),
      this.fetchBalanceInGroup(address, PENDLE_V_2_DEFINITION.groups.pool.label),
    ]);
    return presentBalanceFetcherResponse([
      {
        label: 'Principal Tokens',
        assets: ptBalances,
      },
      {
        label: 'Yield Tokens',
        assets: ytBalances,
      },
      {
        label: 'Standardized Yield Tokens',
        assets: syBalances,
      },
      {
        label: 'Pools',
        assets: lpBalances,
      },
    ]);
  }
}
