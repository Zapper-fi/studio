import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import { YEARN_DEFINITION } from '../yearn.definition';

@Register.BalanceFetcher(YEARN_DEFINITION.id, Network.FANTOM_OPERA_MAINNET)
export class FantomYearnBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getVaultBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.FANTOM_OPERA_MAINNET,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.vault.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [vaultBalances] = await Promise.all([this.getVaultBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
    ]);
  }
}
