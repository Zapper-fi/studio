import { Inject } from '@nestjs/common';
import { SingleStakingContractPositionBalanceHelper, TokenBalanceHelper } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalancerGauge, BalancerV2ContractFactory } from '~apps/balancer-v2/contracts';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXContractFactory, BeethovenXMasterchef } from '../contracts';

const appId = BEETHOVEN_X_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class OptimismBeethovenXBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
  ) {}

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: BEETHOVEN_X_DEFINITION.groups.pool.id,
    });
  }

  async getFarmBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<BalancerGauge>({
      address,
      network,
      appId,
      groupId: BEETHOVEN_X_DEFINITION.groups.farm.id,
      resolveContract: ({ address, network }) => this.balancerV2ContractFactory.balancerGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        return Promise.all(rewardTokens.map(v => wrappedContract.claimable_reward(address, v.address)));
      },
    });
  }

  async getBalances(address: string) {
    const [poolBalances, farmBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getFarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
    ]);
  }
}
