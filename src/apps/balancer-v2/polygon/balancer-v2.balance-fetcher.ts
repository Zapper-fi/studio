import { Inject } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper, TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerGauge, BalancerV2ContractFactory } from '../contracts';

const appId = BALANCER_V2_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(appId, network)
export class PolygonBalancerV2BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
  ) {}

  async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<BalancerGauge>({
      address,
      network,
      appId,
      groupId: BALANCER_V2_DEFINITION.groups.farm.id,
      resolveContract: ({ address, network }) => this.balancerV2ContractFactory.balancerGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: () => [],
    });
  }

  async getPoolBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: BALANCER_V2_DEFINITION.groups.pool.id,
    });
  }

  async getBalances(address: string) {
    const [poolBalances, stakedBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Staked',
        assets: stakedBalances,
      },
    ]);
  }
}
