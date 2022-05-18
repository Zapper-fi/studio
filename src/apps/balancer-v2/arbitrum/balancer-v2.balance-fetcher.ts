import { Inject } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper, TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerGauge, BalancerV2ContractFactory } from '../contracts';
import { BalancerV2ClaimableContractPositionBalanceHelper } from '../helpers/balancer-v2.claimable.contract-position-balance-helper';

const appId = BALANCER_V2_DEFINITION.id;
const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class ArbitrumBalancerV2BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(BalancerV2ClaimableContractPositionBalanceHelper)
    private readonly balancerV2ClaimableContractPositionBalanceHelper: BalancerV2ClaimableContractPositionBalanceHelper,
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
  ) {}

  async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<BalancerGauge>({
      address,
      network,
      appId,
      groupId: BALANCER_V2_DEFINITION.groups.farm.id,
      resolveContract: ({ address, network }) => this.balancerV2ContractFactory.balancerGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        return Promise.all(rewardTokens.map(v => wrappedContract.claimable_reward(address, v.address)));
      },
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

  async getClaimableBalances(address: string) {
    return this.balancerV2ClaimableContractPositionBalanceHelper.getContractPositionBalances({
      address,
      network,
    });
  }

  async getBalances(address: string) {
    const [poolBalances, stakedBalances, claimableBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getStakedBalances(address),
      this.getClaimableBalances(address),
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
      {
        label: 'Claimable',
        assets: claimableBalances,
      },
    ]);
  }
}
