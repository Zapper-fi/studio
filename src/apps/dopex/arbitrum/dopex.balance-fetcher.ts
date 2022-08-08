import { Inject } from '@nestjs/common';
import { padEnd } from 'lodash';
import Web3 from 'web3';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import {
  DopexContractFactory,
  DopexDpxSsov,
  DopexEthSsov,
  DopexGmxSsov,
  DopexGOhmSsov,
  DopexRdpxSsov,
  DopexStaking,
  DopexVotingEscrow,
  DopexVotingEscrowRewards,
} from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';
import { DopexSsovClaimableBalancesStrategy } from '../helpers/dopex.ssov.claimable-balances-strategy';
import { DopexSsovContractPositionBalanceHelper } from '../helpers/dopex.ssov.contract-position-balance-helper';
import { DopexSsovDepositBalanceStrategy } from '../helpers/dopex.ssov.deposit-balance-strategy';

const network = Network.ARBITRUM_MAINNET;
const appId = DOPEX_DEFINITION.id;

@Register.BalanceFetcher(appId, network)
export class ArbitrumDopexBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DopexSsovContractPositionBalanceHelper)
    private readonly dopexSsovContractPositionBalanceHelper: DopexSsovContractPositionBalanceHelper,
    @Inject(DopexContractFactory)
    private readonly dopexContractFactory: DopexContractFactory,
    @Inject(DopexSsovDepositBalanceStrategy)
    private readonly dopexSsovDepositBalanceStrategy: DopexSsovDepositBalanceStrategy,
    @Inject(DopexSsovClaimableBalancesStrategy)
    private readonly dopexSsovClaimableBalancesStrategy: DopexSsovClaimableBalancesStrategy,
    @Inject(CurveVotingEscrowContractPositionBalanceHelper)
    private readonly curveVotingEscrowContractPositionBalanceHelper: CurveVotingEscrowContractPositionBalanceHelper,
  ) {}

  private async getSsovBalances(address: string) {
    return Promise.all([
      this.dopexSsovContractPositionBalanceHelper.getBalances<DopexDpxSsov>({
        address,
        appId,
        groupId: DOPEX_DEFINITION.groups.dpxSsov.id,
        network,
        resolveSsovContract: ({ address, network }) => this.dopexContractFactory.dopexDpxSsov({ address, network }),
        resolveDepositBalance: this.dopexSsovDepositBalanceStrategy.build({
          resolveFinalEpochStrikeBalance: ({ contract, multicall, contractPosition }) =>
            multicall
              .wrap(contract)
              .totalEpochStrikeBalance(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
        }),
        resolveExtraClaimableBalances: this.dopexSsovClaimableBalancesStrategy.build({
          resolveTotalEpochStrikeBalance: ({ contract, multicall, contractPosition }) =>
            multicall
              .wrap(contract)
              .totalEpochStrikeRdpxBalance(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
        }),
      }),
      this.dopexSsovContractPositionBalanceHelper.getBalances<DopexRdpxSsov>({
        address,
        appId,
        groupId: DOPEX_DEFINITION.groups.rdpxSsov.id,
        network,
        resolveSsovContract: ({ address, network }) => this.dopexContractFactory.dopexRdpxSsov({ address, network }),
        resolveDepositBalance: this.dopexSsovDepositBalanceStrategy.build({
          resolveFinalEpochStrikeBalance: ({ contract, multicall, contractPosition }) =>
            multicall
              .wrap(contract)
              .totalEpochStrikeBalance(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
        }),
        resolveExtraClaimableBalances: this.dopexSsovClaimableBalancesStrategy.build({
          resolveTotalEpochStrikeBalance: ({ contract, multicall, contractPosition }) =>
            multicall
              .wrap(contract)
              .totalEpochStrikeDpxBalance(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
        }),
      }),
      this.dopexSsovContractPositionBalanceHelper.getBalances<DopexEthSsov>({
        address,
        appId,
        groupId: DOPEX_DEFINITION.groups.ethSsov.id,
        network,
        resolveSsovContract: ({ address, network }) => this.dopexContractFactory.dopexEthSsov({ address, network }),
        resolveDepositBalance: this.dopexSsovDepositBalanceStrategy.build({
          resolveFinalEpochStrikeBalance: ({ contract, multicall, contractPosition }) =>
            multicall
              .wrap(contract)
              .totalEpochStrikeEthBalance(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
        }),
        resolveExtraClaimableBalances: this.dopexSsovClaimableBalancesStrategy.build({
          resolveTotalEpochStrikeBalance: async ({ contract, multicall, contractPosition }) => {
            const rdName = Web3.utils.asciiToHex('RewardsDistribution');
            const rdNamePadded = padEnd(rdName, 66, '0');
            const rdAddress = await multicall.wrap(contract).getAddress(rdNamePadded);
            const rdContract = this.dopexContractFactory.dopexRewardDistribution({
              address: rdAddress,
              network: contractPosition.network,
            });

            return Promise.all([
              multicall.wrap(rdContract).dpxReceived(contractPosition.dataProps.epoch),
              multicall.wrap(rdContract).rdpxReceived(contractPosition.dataProps.epoch),
            ]);
          },
        }),
      }),
      this.dopexSsovContractPositionBalanceHelper.getBalances<DopexGOhmSsov>({
        address,
        appId,
        groupId: DOPEX_DEFINITION.groups.gohmSsov.id,
        network,
        resolveSsovContract: ({ address, network }) => this.dopexContractFactory.dopexGOhmSsov({ address, network }),
        resolveDepositBalance: this.dopexSsovDepositBalanceStrategy.build({
          resolveFinalEpochStrikeBalance: ({ contract, multicall, contractPosition }) =>
            multicall
              .wrap(contract)
              .totalEpochStrikeGohmBalance(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
        }),
      }),
      this.dopexSsovContractPositionBalanceHelper.getBalances<DopexGmxSsov>({
        address,
        appId,
        groupId: DOPEX_DEFINITION.groups.gmxSsov.id,
        network,
        resolveSsovContract: ({ address, network }) => this.dopexContractFactory.dopexGmxSsov({ address, network }),
        resolveDepositBalance: this.dopexSsovDepositBalanceStrategy.build({
          resolveFinalEpochStrikeBalance: async ({ contract, multicall, contractPosition }) =>
            multicall
              .wrap(contract)
              .totalEpochStrikeGmxBalance(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
        }),
        resolveExtraClaimableBalances: this.dopexSsovClaimableBalancesStrategy.build({
          resolveTotalEpochStrikeBalance: async ({ contract, multicall, contractPosition }) => {
            const [claimedFees, totalEpochStrikeDeposits, totalEpochDeposits] = await Promise.all([
              multicall.wrap(contract).totalGmxFeesClaimed(contractPosition.dataProps.strike),
              multicall
                .wrap(contract)
                .totalEpochStrikeDeposits(contractPosition.dataProps.epoch, contractPosition.dataProps.strike),
              multicall.wrap(contract).totalEpochDeposits(contractPosition.dataProps.epoch),
            ]);

            const totalFeesClaimableForStrike = (
              (Number(claimedFees) * Number(totalEpochStrikeDeposits)) /
              Number(totalEpochDeposits)
            ).toFixed(0);

            return totalFeesClaimableForStrike;
          },
        }),
      }),
    ]).then(v => v.flat());
  }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<DopexStaking>({
      address,
      appId,
      groupId: DOPEX_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.dopexContractFactory.dopexStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .earned(address)
          .then(v => [v.DPXtokensEarned, v.RDPXtokensEarned]),
    });
  }

  private async getVotingEscrowBalances(address: string) {
    return this.curveVotingEscrowContractPositionBalanceHelper.getBalances<DopexVotingEscrow, DopexVotingEscrowRewards>(
      {
        address,
        appId,
        groupId: DOPEX_DEFINITION.groups.votingEscrow.id,
        network,
        resolveContract: ({ address }) => this.dopexContractFactory.dopexVotingEscrow({ network, address }),
        resolveRewardContract: ({ address }) =>
          this.dopexContractFactory.dopexVotingEscrowRewards({ network, address }),
        resolveLockedTokenBalance: ({ contract, multicall }) =>
          multicall
            .wrap(contract)
            .locked(address)
            .then(v => v.amount),
        resolveRewardTokenBalance: ({ contract, multicall }) => multicall.wrap(contract).earned(address),
      },
    );
  }

  async getBalances(address: string) {
    const [ssovBalances, stakedBalances, votingEscrowBalances] = await Promise.all([
      this.getSsovBalances(address),
      this.getStakedBalances(address),
      this.getVotingEscrowBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'SSOVs',
        assets: [...ssovBalances],
      },
      {
        label: 'Staking',
        assets: [...stakedBalances],
      },
      {
        label: 'Voting Escrow',
        assets: votingEscrowBalances,
      },
    ]);
  }
}
