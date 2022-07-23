import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlutusEpochStaking } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

import { VAULTS } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.lock.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusLockContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly plutusContractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    const positions =
      this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PlutusEpochStaking>({
        network,
        appId,
        groupId,
        dependencies: [
          {
            appId: PLUTUS_DEFINITION.id,
            groupIds: [PLUTUS_DEFINITION.groups.plsDpx.id, PLUTUS_DEFINITION.groups.plsJones.id],
            network,
          },
        ],
        resolveFarmAddresses: () => [VAULTS.PLS_LOCK_1_MONTH, VAULTS.PLS_LOCK_3_MONTH, VAULTS.PLS_LOCK_6_MONTH],
        resolveFarmContract: ({ address, network }) =>
          this.plutusContractFactory.plutusEpochStaking({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).pls(),
        resolveRewardTokenAddresses: async ({ contract, multicall }) => {
          const stakingRewardsAddress = await multicall.wrap(contract).stakingRewards();
          if (stakingRewardsAddress === ZERO_ADDRESS) return [];

          const stakingRewardsContract = this.plutusContractFactory.plutusEpochStakingRewardsRolling({
            address: stakingRewardsAddress,
            network,
          });

          return Promise.all([
            multicall.wrap(stakingRewardsContract).plsDPX(),
            multicall.wrap(stakingRewardsContract).plsJONES(),
          ]);
        },
        resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
      });

    return positions;
  }
}
