import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import { IlluviumContractFactory, IlluviumCorePool, IlluviumIlvPoolV2 } from '../contracts';
import { ILLUVIUM_DEFINITION } from '../illuvium.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ILLUVIUM_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumIlluviumBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IlluviumContractFactory) private readonly contractFactory: IlluviumContractFactory,
  ) {}

  async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<IlluviumCorePool>({
      address,
      appId: ILLUVIUM_DEFINITION.id,
      groupId: ILLUVIUM_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.illuviumCorePool({ network, address }),
      resolveStakedTokenBalance: ({ multicall, contract }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: async ({ multicall, contract }) => {
        const [pendingVaultRewardsRaw, pendingYieldRewardsRaw] = await Promise.all([
          multicall.wrap(contract).pendingVaultRewards(address),
          multicall.wrap(contract).pendingYieldRewards(address),
        ]);

        return pendingVaultRewardsRaw.add(pendingYieldRewardsRaw);
      },
    });
  }

  async getStakedV2Balances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<IlluviumIlvPoolV2>({
      address,
      appId: ILLUVIUM_DEFINITION.id,
      groupId: ILLUVIUM_DEFINITION.groups.farmV2.id,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.illuviumIlvPoolV2({ network, address }),
      resolveStakedTokenBalance: ({ multicall, contract }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: async ({ multicall, contract }) => multicall.wrap(contract).pendingRewards(address),
    });
  }

  async getBalances(address: string) {
    const stakedContractPositions = await this.getStakedBalances(address);

    return presentBalanceFetcherResponse([
      {
        label: 'Staked',
        assets: stakedContractPositions,
      },
    ]);
  }
}
