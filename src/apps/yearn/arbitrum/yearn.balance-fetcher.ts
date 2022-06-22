import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { YEARN_DEFINITION } from '../yearn.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(YEARN_DEFINITION.id, Network.ARBITRUM_MAINNET)
export class ArbitrumYearnBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getV1VaultBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.v1Vault.id,
      address,
    });
  }

  private async getV2VaultBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.v2Vault.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [v1VaultBalances, v2VaultBalances] = await Promise.all([
      this.getV1VaultBalances(address),
      this.getV2VaultBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults (V1)',
        assets: v1VaultBalances,
      },
      {
        label: 'Vaults (V2)',
        assets: v2VaultBalances,
      },
    ]);
  }
}
