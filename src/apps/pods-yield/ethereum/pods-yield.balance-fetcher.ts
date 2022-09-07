import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PodsYieldContractFactory } from '../contracts';
import { PODS_YIELD_DEFINITION } from '../pods-yield.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(PODS_YIELD_DEFINITION.id, network)
export class EthereumPodsYieldBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PodsYieldContractFactory) private readonly podsYieldContractFactory: PodsYieldContractFactory,
  ) {}

  async getStrategyTokenBalance(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: PODS_YIELD_DEFINITION.id,
      groupId: PODS_YIELD_DEFINITION.groups.strategy.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getQueueBalance(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: PODS_YIELD_DEFINITION.id,
      groupId: PODS_YIELD_DEFINITION.groups.queue.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const token = contractPosition.tokens[0];
        const contract = this.podsYieldContractFactory.vault(contractPosition);

        const [queuedBalanceRaw] = await Promise.all([multicall.wrap(contract).idleAssetsOf(address)]);

        return [drillBalance(token, queuedBalanceRaw.toString())];
      },
    });
  }

  async getBalances(address: string) {
    const [strategyTokenBalances, queueBalances] = await Promise.all([
      this.getStrategyTokenBalance(address),
      this.getQueueBalance(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Strategies',
        assets: strategyTokenBalances,
      },
      {
        label: 'Queues',
        assets: queueBalances,
      },
    ]);
  }
}
