import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ENZYME_FINANCE_DEFINITION } from '../enzyme-finance.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ENZYME_FINANCE_DEFINITION.id, network)
export class EthereumEnzymeFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getVaultTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: ENZYME_FINANCE_DEFINITION.id,
      groupId: ENZYME_FINANCE_DEFINITION.groups.vault.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [vaultTokenBalances] = await Promise.all([this.getVaultTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultTokenBalances,
      },
    ]);
  }
}
