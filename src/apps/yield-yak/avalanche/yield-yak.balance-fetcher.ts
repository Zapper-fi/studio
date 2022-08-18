import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { YieldYakChef, YieldYakContractFactory } from '../contracts';
import { YIELD_YAK_DEFINITION } from '../yield-yak.definition';

const appId = YIELD_YAK_DEFINITION.id;
const name = YIELD_YAK_DEFINITION.name;
const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(appId, network)
export class AvalancheYieldyakBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldYakContractFactory) private readonly contractFactory: YieldYakContractFactory,
  ) {}

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: YIELD_YAK_DEFINITION.groups.vault.id,
    });
  }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<YieldYakChef>({
      address,
      appId,
      network,
      groupId: YIELD_YAK_DEFINITION.groups.farm.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.yieldYakChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) =>
          multicall.wrap(contract).pendingRewards(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [poolBalances, stakedBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: name,
        assets: [...poolBalances, ...stakedBalances],
      },
    ]);
  }
}
