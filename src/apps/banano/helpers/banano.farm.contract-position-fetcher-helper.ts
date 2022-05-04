import { Inject, Injectable } from '@nestjs/common';

import { MasterChefContractPositionDataProps } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { Benis, BananoContractFactory } from '../contracts';

@Injectable()
export class BananoFarmContractPositionFetcherHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BananoContractFactory) private readonly contractFactory: BananoContractFactory,
  ) {}

  async getPools(
    network: Network,
    appId: string,
    groupId: string,
    benisAddress: string,
    dependencies: AppGroupsDefinition[],
  ): Promise<ContractPosition<MasterChefContractPositionDataProps>[]> {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<Benis>({
      address: benisAddress,
      appId,
      groupId,
      network,
      dependencies,
      rewardRateUnit: RewardRateUnit.SECOND,
      resolveContract: ({ address, network }) => this.contractFactory.benis({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(poolInfo => poolInfo.stakingToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).wban(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(poolInfo => poolInfo.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).wbanPerSecond(),
      }),
    });
  }
}
