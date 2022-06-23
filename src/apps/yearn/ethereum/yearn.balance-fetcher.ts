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

  private async getV1VaultTokenBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.v1Vault.id,
      network,
    });
  }

  private async getV2VaultTokenBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YEARN_DEFINITION.id,
      groupId: YEARN_DEFINITION.groups.v2Vault.id,
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
    const [yieldTokenBalances, v1VaultTokenBalances, v2VaultTokenBalances, governanceBalances] = await Promise.all([
      this.getYieldTokens(address),
      this.getV1VaultTokenBalances(address),
      this.getV2VaultTokenBalances(address),
      this.getGovernanceBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Yield Tokens',
        assets: yieldTokenBalances,
      },
      {
        label: 'Vaults (V1)',
        assets: v1VaultTokenBalances,
      },
      {
        label: 'Vaults',
        assets: v2VaultTokenBalances,
      },
      {
        label: 'Governance',
        assets: governanceBalances,
      },
    ]);
  }
}
