import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BANCOR_DEFINITION } from '../bancor.definition';
import { BancorContractFactory, StandardRewards } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(BANCOR_DEFINITION.id, network)
export class EthereumBancorBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorContractFactory) private readonly bancorContractFactory: BancorContractFactory,
  ) {}

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<StandardRewards>({
      address,
      appId: BANCOR_DEFINITION.id,
      groupId: BANCOR_DEFINITION.groups.v3.id,
      network: Network.ETHEREUM_MAINNET,
      resolveChefContract: ({ contractAddress, network }) =>
        this.bancorContractFactory.standardRewards({ address: contractAddress, network }),
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
    const assets = await this.getPoolBalances(address);
    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets,
      },
    ]);
  }
}
