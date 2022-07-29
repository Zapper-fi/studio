import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveVestingEscrow, CurveVotingEscrow, CurveVotingEscrowReward } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveGaugeDefaultContractPositionBalanceHelper } from '../helpers/curve.gauge.default.contract-position-balance-helper';
import { CurveVestingEscrowContractPositionBalanceHelper } from '../helpers/curve.vesting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionBalanceHelper } from '../helpers/curve.voting-escrow.contract-position-balance-helper';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(CURVE_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumCurveBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveVotingEscrowContractPositionBalanceHelper)
    private readonly curveVotingEscrowContractPositionBalanceHelper: CurveVotingEscrowContractPositionBalanceHelper,
    @Inject(CurveVestingEscrowContractPositionBalanceHelper)
    private readonly curveVestingEscrowContractPositionBalanceHelper: CurveVestingEscrowContractPositionBalanceHelper,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveGaugeDefaultContractPositionBalanceHelper)
    private readonly curveGaugeDefaultContractPositionBalanceHelper: CurveGaugeDefaultContractPositionBalanceHelper,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.pool.id,
      address,
    });
  }

  private async getStakedBalances(address: string) {
    return this.curveGaugeDefaultContractPositionBalanceHelper.getBalances({
      address,
      network,
    });
  }

  private async getVotingEscrowBalances(address: string) {
    return this.curveVotingEscrowContractPositionBalanceHelper.getBalances<CurveVotingEscrow, CurveVotingEscrowReward>({
      address,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.votingEscrow.id,
      network,
      resolveContract: ({ address }) => this.curveContractFactory.curveVotingEscrow({ network, address }),
      resolveRewardContract: ({ address }) => this.curveContractFactory.curveVotingEscrowReward({ network, address }),
      resolveLockedTokenBalance: ({ contract, multicall }) =>
        multicall
          .wrap(contract)
          .locked(address)
          .then(v => v.amount),
      resolveRewardTokenBalance: ({ contract }) => contract.callStatic['claim()']({ from: address }),
    });
  }

  private async getVestingEscrowBalances(address: string) {
    return this.curveVestingEscrowContractPositionBalanceHelper.getBalances<CurveVestingEscrow>({
      address,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.vestingEscrow.id,
      network,
      resolveContract: ({ contractFactory, address }) => contractFactory.curveVestingEscrow({ network, address }),
      resolveLockedBalance: ({ contract, multicall }) => multicall.wrap(contract).lockedOf(address),
      resolveUnlockedBalance: ({ contract, multicall }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, stakedBalances, votingEscrowBalances, vestingEscrowBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getStakedBalances(address),
      this.getVotingEscrowBalances(address),
      this.getVestingEscrowBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Staking',
        assets: stakedBalances,
      },
      {
        label: 'Voting Escrow',
        assets: votingEscrowBalances,
      },
      {
        label: 'Vesting',
        assets: vestingEscrowBalances,
      },
    ]);
  }
}
