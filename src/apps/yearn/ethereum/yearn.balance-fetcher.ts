import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SynthetixContractFactory, SynthetixRewards } from '~apps/synthetix';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { YEARN_DEFINITION } from '../yearn.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(YEARN_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumYearnBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
  ) {}

  private async getYieldTokens(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.yield.id,
      network,
    });
  }

  private async getVaultTokenBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.vault.id,
      network,
    });
  }

  private async getGovernanceBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<SynthetixRewards>({
      address,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.governance.id,
      network,
      resolveContract: ({ address, network }) => this.synthetixContractFactory.synthetixRewards({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  async getBalances(address: string) {
    const [yieldTokenBalances, vaultTokenBalances, governanceBalances] = await Promise.all([
      this.getYieldTokens(address),
      this.getVaultTokenBalances(address),
      this.getGovernanceBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Yield Tokens',
        assets: yieldTokenBalances,
      },
      {
        label: 'Vaults',
        assets: vaultTokenBalances,
      },
      {
        label: 'Governance',
        assets: governanceBalances,
      },
    ]);
  }
}
