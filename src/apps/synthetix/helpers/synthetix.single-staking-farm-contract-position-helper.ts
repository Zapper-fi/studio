import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmResolveIsActiveParams,
  SingleStakingFarmResolveRoisParams,
} from '~app-toolkit/helpers/position/single-staking-farm.contract-position-helper';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory, SynthetixRewards } from '../contracts';

import { SynthetixSingleStakingIsActiveStrategy } from './synthetix.single-staking.is-active-strategy';
import { SynthetixSingleStakingRoiStrategy } from './synthetix.single-staking.roi-strategy';

export type SynthetixSingleStakingFarmContractPositionHelperParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  resolveIsActive?: SingleStakingFarmResolveIsActiveParams<T>;
  resolveRois?: SingleStakingFarmResolveRoisParams<T>;
  farmDefinitions: SingleStakingFarmDefinition[];
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class SynthetixSingleStakingFarmContractPositionHelper {
  constructor(
    @Inject(SynthetixContractFactory)
    private readonly contractFactory: SynthetixContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly isActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly roiStrategy: SynthetixSingleStakingRoiStrategy,
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
  ) {}

  getContractPositions({
    farmDefinitions,
    dependencies = [],
    resolveIsActive = this.defaultIsActive(),
    resolveRois = this.defaultRois(),
    ...opts
  }: SynthetixSingleStakingFarmContractPositionHelperParams<SynthetixRewards>) {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<SynthetixRewards>({
      ...opts,
      dependencies,
      resolveFarmDefinitions: async () => farmDefinitions,
      resolveFarmContract: ({ network, address }) => this.contractFactory.synthetixRewards({ network, address }),
      resolveIsActive,
      resolveRois,
    });
  }

  defaultIsActive(): SingleStakingFarmResolveIsActiveParams<SynthetixRewards> {
    return this.isActiveStrategy.build<SynthetixRewards>({
      resolvePeriodFinish: ({ contract, multicall }) => multicall.wrap(contract).periodFinish(),
    });
  }

  defaultRois(): SingleStakingFarmResolveRoisParams<SynthetixRewards> {
    return this.roiStrategy.build<SynthetixRewards>({
      resolveRewardRates: ({ contract, multicall }) => multicall.wrap(contract).rewardRate(),
    });
  }
}
