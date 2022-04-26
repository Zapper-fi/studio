import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleMiniChefV2, PickleRewarder } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.BalanceFetcher(PICKLE_DEFINITION.id, Network.ARBITRUM_MAINNET)
export class ArbitrumPickleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) private readonly contractFactory: PickleContractFactory,
  ) {}

  private async getJarBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.ARBITRUM_MAINNET,
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.jar.id,
      address,
    });
  }

  private async getFarmBalances(address: string) {
    const network = Network.ARBITRUM_MAINNET;

    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PickleMiniChefV2>({
      address,
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.masterchefV2Farm.id,
      network,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.pickleMiniChefV2({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefRewarderClaimableBalanceStrategy.build<
        PickleMiniChefV2,
        PickleRewarder
      >({
        resolvePrimaryClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingPickle(contractPosition.dataProps.poolIndex, address),
        resolveRewarderAddress: ({ contract, contractPosition, multicall }) =>
          multicall.wrap(contract).rewarder(contractPosition.dataProps.poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.pickleRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableBalance: ({ multicall, rewarderContract, contractPosition, address }) =>
          multicall
            .wrap(rewarderContract)
            .pendingTokens(contractPosition.dataProps.poolIndex, address, 0)
            .then(v => v.rewardAmounts[0]),
      }),
    });
  }

  async getBalances(address: string) {
    const [farmBalances, jarBalances] = await Promise.all([
      this.getFarmBalances(address),
      this.getJarBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Farms',
        assets: farmBalances,
      },
      {
        label: 'Jars',
        assets: jarBalances,
      },
    ]);
  }
}
