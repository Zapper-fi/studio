import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PlutusViemContractFactory } from '../contracts';
import { PlutusLock } from '../contracts/viem';

const PLUTUS_LOCKS = [
  {
    lockDuration: 1,
    address: '0x27aaa9d562237bf8e024f9b21de177e20ae50c05',
    stakedTokenAddress: '0x51318b7d00db7acc4026c88c3952b66278b6a67f',
    rewardsDistributor: '0x50b3091b4188edfa3589b341adfb078edb93addd',
    rewardTokenAddresses: [
      '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
      '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
    ],
  },
  {
    lockDuration: 3,
    address: '0xe59dadf5f7a9decb8337402ccdf06abe5c0b2b3e',
    stakedTokenAddress: '0x51318b7d00db7acc4026c88c3952b66278b6a67f',
    rewardsDistributor: '0x29640422bb775917102079cf259cc8f5ca7dbce8',
    rewardTokenAddresses: [
      '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
      '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
    ],
  },
  {
    lockDuration: 6,
    address: '0xbeb981021ed9c85aa51d96c0c2eda10ee4404a2e',
    stakedTokenAddress: '0x51318b7d00db7acc4026c88c3952b66278b6a67f',
    rewardsDistributor: '0x6e1954da37fad279114035a45da49ca30ea5a988',
    rewardTokenAddresses: [
      '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
      '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
    ],
  },
];

@PositionTemplate()
export class ArbitrumPlutusLockContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PlutusLock> {
  groupLabel = 'Locked PLS';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusViemContractFactory) protected readonly contractFactory: PlutusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.plutusLock({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return PLUTUS_LOCKS;
  }

  async getRewardRates() {
    return [0, 0];
  }

  async getIsActive() {
    return true;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PlutusLock>) {
    const lockDuration = PLUTUS_LOCKS.find(v => v.address === contractPosition.address)!.lockDuration;
    return `PLS ${lockDuration} Month Lock`;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusLock>) {
    return contract.read.stakedDetails([address]).then(details => details.amount);
  }

  async getRewardTokenBalances({ contractPosition, contract, address, multicall }: GetTokenBalancesParams<PlutusLock>) {
    const rewardsAddress = PLUTUS_LOCKS.find(v => v.address === contractPosition.address)!.rewardsDistributor;
    const rewardsContract = this.contractFactory.plutusEpochStakingRewardsRolling({
      address: rewardsAddress,
      network: this.network,
    });

    const currentEpoch = await multicall.wrap(contract).read.currentEpoch();
    const epochsToClaim = range(0, Number(currentEpoch));
    const claimAmounts = await Promise.all(
      epochsToClaim.map(async epoch => {
        const EPOCH_DURATION = 2_628_000; // seconds

        const rewardsForEpoch = await multicall.wrap(rewardsContract).read.epochRewards([epoch]);
        const claimDetails = await multicall.wrap(rewardsContract).read.claimDetails([address, epoch]);

        const userPlsDpxShare = await multicall
          .wrap(rewardsContract)
          .calculateShare(address, epoch, rewardsForEpoch.plsDpx);
        const userPlsJonesShare = await multicall
          .wrap(rewardsContract)
          .calculateShare(address, epoch, rewardsForEpoch.plsJones);
        if (Number(userPlsDpxShare) === 0 && Number(userPlsJonesShare) === 0)
          return [new BigNumber(0), new BigNumber(0)];

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
  }
}
