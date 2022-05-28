import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types';

import { LlamaAirforceAirdropBalancesHelper } from '../helpers/llama-airforce.airdrop.balance-helper';
import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

const appId = LLAMA_AIRFORCE_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumLlamaAirforceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LlamaAirforceAirdropBalancesHelper)
    private readonly airdropBalancesHelper: LlamaAirforceAirdropBalancesHelper,
  ) {}

  private async getVaultBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: LLAMA_AIRFORCE_DEFINITION.groups.vault.id,
    });
  }

  private async getAirdropBalances(address: string) {
    return this.airdropBalancesHelper.getBalances({ address });
  }

  async getBalances(address: string) {
    const [vaultBalances, airdropBalances] = await Promise.all([
      this.getVaultBalances(address),
      this.getAirdropBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
      {
        label: 'Airdrop',
        assets: airdropBalances,
      },
    ]);
  }
}
