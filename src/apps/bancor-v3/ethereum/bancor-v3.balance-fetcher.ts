import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BANCOR_V3_DEFINITION } from '../bancor-v3.definition';
import { BancorV3ContractFactory, StandardRewards } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(BANCOR_V3_DEFINITION.id, network)
export class EthereumBancorV3BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ContractFactory) private readonly contractFactory: BancorV3ContractFactory,
  ) {}

  async getTokenBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: BANCOR_V3_DEFINITION.id,
      groupId: BANCOR_V3_DEFINITION.groups.pool.id,
      network,
    });
  }

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<StandardRewards>({
      address,
      appId: BANCOR_V3_DEFINITION.id,
      groupId: BANCOR_V3_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.standardRewards({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        // Note: each asset can have multiple positions (currently 2)
        resolveStakedBalance: ({ contract, multicall, contractPosition }) => {
          return multicall.wrap(contract).providerStake(address, contractPosition.dataProps.poolIndex + 1);
        },
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) => {
          // TODO: support ExternalRewardsVault too
          return multicall.wrap(contract).pendingRewards(address, [contractPosition.dataProps.poolIndex + 1]);
        },
      }),
    });
  }

  async getBalances(address: string) {
    const [tokenBalances, poolBalances] = await Promise.all([
      this.getTokenBalances(address),
      this.getPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Tokens',
        assets: tokenBalances,
      },
      {
        label: 'Pools',
        assets: poolBalances,
      },
    ]);
  }
}
