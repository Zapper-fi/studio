import { Inject } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper, TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerGauge, BalancerV2ContractFactory, BalancerVeBal } from '../contracts';
import { BalancerV2ClaimableContractPositionBalanceHelper } from '../helpers/balancer-v2.claimable.contract-position-balance-helper';

const { id } = BALANCER_V2_DEFINITION;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(id, network)
export class EthereumBalancerV2BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(CurveVotingEscrowContractPositionBalanceHelper)
    private readonly curveVotingEscrowContractPositionBalanceHelper: CurveVotingEscrowContractPositionBalanceHelper,
    @Inject(BalancerV2ClaimableContractPositionBalanceHelper)
    private readonly balancerV2ClaimableContractPositionBalanceHelper: BalancerV2ClaimableContractPositionBalanceHelper,
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
  ) {}

  async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<BalancerGauge>({
      address,
      network,
      appId: id,
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
      appId: BALANCER_V2_DEFINITION.id,
      groupId: BALANCER_V2_DEFINITION.groups.pool.id,
    });
  }

  async getClaimableBalances(address: string) {
    return this.balancerV2ClaimableContractPositionBalanceHelper.getContractPositionBalances({
      address,
      network,
    });
  }

  private async getVotingEscrowBalances(address: string) {
    return this.curveVotingEscrowContractPositionBalanceHelper.getBalances<BalancerVeBal>({
      address,
      network,
      appId: BALANCER_V2_DEFINITION.id,
      groupId: BALANCER_V2_DEFINITION.groups.votingEscrow.id,
      resolveContract: ({ address }) => this.balancerV2ContractFactory.balancerVeBal({ network, address }),
      resolveLockedTokenBalance: ({ contract, multicall }) =>
        multicall
          .wrap(contract)
          .locked(address)
          .then(v => v.amount),
    });
  }

  async getBalances(address: string) {
    const [poolBalances, stakedBalances, claimableBalances, veBalBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getStakedBalances(address),
      this.getClaimableBalances(address),
      this.getVotingEscrowBalances(address),
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
      {
        label: 'Voting Escrow',
        assets: veBalBalances,
      },
    ]);
  }
}
