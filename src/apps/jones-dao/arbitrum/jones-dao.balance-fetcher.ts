import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SynthetixContractFactory, SynthetixRewards } from '~apps/synthetix';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { JONES_DAO_DEFINITION } from '../jones-dao.definition';

const appId = JONES_DAO_DEFINITION.id;
const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class ArbitrumJonesDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
  ) {}

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<SynthetixRewards>({
      appId,
      network,
      address,
      groupId: JONES_DAO_DEFINITION.groups.farm.id,
      resolveContract: ({ address, network }) => this.synthetixContractFactory.synthetixRewards({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  private async getVaultBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: JONES_DAO_DEFINITION.groups.vault.id,
    });
  }

  async getBalances(address: string) {
    const [stakedBalances, vaultBalances] = await Promise.all([
      this.getStakedBalances(address),
      this.getVaultBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
      {
        label: 'Farms',
        assets: stakedBalances,
      },
    ]);
  }
}
