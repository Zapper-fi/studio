import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { JonesDaoContractFactory, JonesMillinerV2, JonesStakingRewards } from '../contracts';
import { JONES_DAO_DEFINITION } from '../jones-dao.definition';

const appId = JONES_DAO_DEFINITION.id;
const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class ArbitrumJonesDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoContractFactory)
    private readonly contractFactory: JonesDaoContractFactory,
  ) {}

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<JonesStakingRewards>({
      appId,
      network,
      address,
      groupId: JONES_DAO_DEFINITION.groups.farm.id,
      resolveContract: ({ address, network }) => this.contractFactory.jonesStakingRewards({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  private async getStakedBalancesV2(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<JonesMillinerV2>({
      address,
      network,
      appId,
      groupId: JONES_DAO_DEFINITION.groups.millinerV2.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.jonesMillinerV2({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingJones(contractPosition.dataProps.poolIndex, address),
      }),
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
    const [vaultBalances, stakedBalances, stakedBalancesV2] = await Promise.all([
      this.getVaultBalances(address),
      this.getStakedBalances(address),
      this.getStakedBalancesV2(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
      {
        label: 'Farms',
        assets: [...stakedBalances, ...stakedBalancesV2],
      },
    ]);
  }
}
