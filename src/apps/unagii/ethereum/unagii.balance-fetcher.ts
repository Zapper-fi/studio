import { Inject } from '@nestjs/common';

import { AppToolkit } from '~app-toolkit/app-toolkit.service';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~app/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { UNAGII_DEFINITION } from '../unagii.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(UNAGII_DEFINITION.id, network)
export class EthereumUnagiiBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(AppToolkit) private readonly appToolkit: AppToolkit) {}

  async getBalances(address: string) {
    const balances = await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: UNAGII_DEFINITION.id,
      groupId: UNAGII_DEFINITION.groups.vault.id,
      address,
    });

    return presentBalanceFetcherResponse([
      {
        label: 'Vault',
        assets: balances,
      },
    ]);
  }
}
