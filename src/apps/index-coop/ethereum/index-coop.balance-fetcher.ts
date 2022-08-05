import { Inject } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SynthetixContractFactory, SynthetixRewards } from '~apps/synthetix';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { INDEX_COOP_DEFINITION } from '../index-coop.definition';

const appId = INDEX_COOP_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumIndexCoopBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  private async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<SynthetixRewards>({
      address,
      appId,
      groupId: INDEX_COOP_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.synthetixContractFactory.synthetixRewards({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  private async getIndexBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: INDEX_COOP_DEFINITION.id,
      groupId: INDEX_COOP_DEFINITION.groups.index.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [indexBalances, stakedBalances] = await Promise.all([
      this.getIndexBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Index',
        assets: indexBalances,
      },
      {
        label: 'Staking',
        assets: stakedBalances,
      },
    ]);
  }
}
