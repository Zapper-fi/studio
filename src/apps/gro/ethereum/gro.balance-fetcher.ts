import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { GroContractFactory, GroLpTokenStaker } from '../contracts';
import { GRO_DEFINITION } from '../gro.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(GRO_DEFINITION.id, network)
export class EthereumGroBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GroContractFactory) private readonly groContractFactory: GroContractFactory,
  ) {}

  private async getPoolsBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<GroLpTokenStaker>({
      address,
      appId: GRO_DEFINITION.id,
      groupId: GRO_DEFINITION.groups.pools.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.groContractFactory.groLpTokenStaker({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.rewardDebt),
      }),
    });
  }

  async getBalances(address: string) {
    const [poolsBalances] = await Promise.all([this.getPoolsBalances(address)]);
    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolsBalances,
      },
    ]);
  }
}
