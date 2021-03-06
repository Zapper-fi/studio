import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import {
  PlutusContractFactory,
  PlsPlutusChef,
  PlsDpxPlutusChef,
  PlsJonesPlutusChef,
  PlutusEpochStaking,
} from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(PLUTUS_DEFINITION.id, network)
export class ArbitrumPlutusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getPlsDpxTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.plsDpx.id,
    });
  }

  async getPlsJonesTokenAddresses(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.plsJones.id,
    });
  }

  async getLockedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<PlutusEpochStaking>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.lock.id,
      resolveContract: ({ address, network }) => this.contractFactory.plutusEpochStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .stakedDetails(address)
          .then(details => details.amount),
      resolveRewardTokenBalances: async ({ contract, address, contractPosition, multicall, network }) => {
        const plsDpx = contractPosition.tokens.find(v => v.symbol === 'plsDPX');
        const plsJones = contractPosition.tokens.find(v => v.symbol === 'plsJONES');
        if (!plsDpx || !plsJones) return [];

        const rewardsAddress = await multicall.wrap(contract).stakingRewards();
        if (rewardsAddress === ZERO_ADDRESS) return [];

        const rewardsContract = this.contractFactory.plutusEpochStakingRewardsRolling({
          address: rewardsAddress,
          network,
        });

        const currentEpoch = await multicall.wrap(contract).currentEpoch();
        const epochsToClaim = range(0, Number(currentEpoch) - 1); // 1 based
        const claimAmounts = await Promise.all(
          epochsToClaim.map(async epoch => {
            const EPOCH_DURATION = 2_628_000; // seconds

            const rewardsForEpoch = await multicall.wrap(rewardsContract).epochRewards(epoch);
            const claimDetails = await multicall.wrap(rewardsContract).claimDetails(address, epoch);
            const userPlsDpxShare = await multicall
              .wrap(rewardsContract)
              .calculateShare(address, epoch, rewardsForEpoch.plsDpx);
            const userPlsJonesShare = await multicall
              .wrap(rewardsContract)
              .calculateShare(address, epoch, rewardsForEpoch.plsJones);
            if (Number(userPlsDpxShare) === 0 && Number(userPlsJonesShare) === 0) return [];

            const now = Date.now() / 1000;
            const vestedDuration =
              claimDetails.lastClaimedTimestamp > rewardsForEpoch.addedAtTimestamp
                ? now - claimDetails.lastClaimedTimestamp
                : now - rewardsForEpoch.addedAtTimestamp;

            const claimablePlsDpx = BigNumber.min(
              new BigNumber(userPlsDpxShare.toString()).times(vestedDuration).div(EPOCH_DURATION),
              new BigNumber(userPlsDpxShare.toString()).minus(claimDetails.plsDpxClaimedAmt.toString()),
            );

            const claimablePlsJones = BigNumber.min(
              new BigNumber(userPlsJonesShare.toString()).times(vestedDuration).div(EPOCH_DURATION),
              new BigNumber(userPlsJonesShare.toString()).minus(claimDetails.plsJonesClaimedAmt.toString()),
            );

            return [claimablePlsDpx, claimablePlsJones];
          }),
        );

        const amounts = claimAmounts.reduce(
          (acc, amounts) => [acc[0].plus(amounts[0]), acc[1].plus(amounts[1])],
          [new BigNumber(0), new BigNumber(0)],
        );

        return [amounts[0].toFixed(0), amounts[1].toFixed(0)];
      },
    });
  }

  async getStakedDPXBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PlsDpxPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.dpx.id,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.plsDpxPlutusChef({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall }) =>
          multicall
            .wrap(contract)
            .userInfo(address)
            .then(info => info.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => [
            info.plsRewardDebt,
            info.plsDpxRewardDebt,
            info.plsJonesRewardDebt,
            info.dpxRewardDebt,
            info.rdpxRewardDebt,
          ]);
        const claimableTokens = contractPosition.tokens.filter(t => t.metaType === MetaType.CLAIMABLE);
        return claimableTokens.map((v, i) => drillBalance(v, pendingTokens[i].toString()));
      },
    });
  }

  async getStakedJonesBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PlsJonesPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.jones.id,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.plsJonesPlutusChef({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall }) =>
          multicall
            .wrap(contract)
            .userInfo(address)
            .then(info => info.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => [info.plsRewardDebt, info.plsDpxRewardDebt, info.plsJonesRewardDebt, info.jonesRewardDebt]);
        const claimableTokens = contractPosition.tokens.filter(t => t.metaType === MetaType.CLAIMABLE);
        return claimableTokens.map((v, i) => drillBalance(v, pendingTokens[i].toString()));
      },
    });
  }

  async getStakedPlsBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PlsPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.stake.id,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.plsPlutusChef({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contractPosition, contract, multicall }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(info => info.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(info => info.rewardDebt),
      }),
    });
  }

  async getBalances(address: string) {
    const [plsDpxTokenBalances, plsJonesTokenBalances, lockedBalances, dpxBalances, jonesBalances, plsBalances] =
      await Promise.all([
        this.getPlsDpxTokenBalances(address),
        this.getPlsJonesTokenAddresses(address),
        this.getLockedBalances(address),
        this.getStakedDPXBalances(address),
        this.getStakedJonesBalances(address),
        this.getStakedPlsBalances(address),
      ]);

    return presentBalanceFetcherResponse([
      {
        label: 'plsDPX',
        assets: plsDpxTokenBalances,
      },
      {
        label: 'plsJONES',
        assets: plsJonesTokenBalances,
      },
      {
        label: 'Locked',
        assets: lockedBalances,
      },
      {
        label: 'Staked',
        assets: [...dpxBalances, ...jonesBalances, ...plsBalances],
      },
    ]);
  }
}
