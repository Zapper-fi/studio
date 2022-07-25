import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { StargateChef, StargateContractFactory } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(STARGATE_DEFINITION.id, network)
export class ArbitrumStargateBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) private readonly contractFactory: StargateContractFactory,
  ) {}

  async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: STARGATE_DEFINITION.id,
      groupId: STARGATE_DEFINITION.groups.pool.id,
      network,
    });
  }

  async getStakedBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<StargateChef>({
      address,
      appId: STARGATE_DEFINITION.id,
      groupId: STARGATE_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.stargateChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingStargate(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, stakedBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Farms',
        assets: stakedBalances,
      },
    ]);
  }
}
