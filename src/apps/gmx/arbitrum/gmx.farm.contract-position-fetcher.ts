import { Inject } from '@nestjs/common';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GmxContractFactory, GmxRewardTracker } from '../contracts';
import GMX_DEFINITION from '../gmx.definition';

export const GMX_FARM = {
  address: '0x908c4d94d34924765f1edc22a1dd098397c59dd4',
  stakedTokenAddress: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca'],
  rewardTrackerAddresses: ['0xd2d1162512f927a7e282ef43a362659e4f2a728f', '0x908c4d94d34924765f1edc22a1dd098397c59dd4'],
};

export const ES_GMX_FARM = {
  address: '0x908c4d94d34924765f1edc22a1dd098397c59dd4',
  stakedTokenAddress: '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca'],
  rewardTrackerAddresses: [],
};

export const GLP_FARM = {
  address: '0x4e971a87900b931ff39d1aad67697f49835400b6',
  stakedTokenAddress: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca'],
  rewardTrackerAddresses: ['0x4e971a87900b931ff39d1aad67697f49835400b6', '0x1addd80e6039594ee970e5872d247bf0414c8903'],
};

export const FARMS = [GMX_FARM, ES_GMX_FARM, GLP_FARM];

const appId = GMX_DEFINITION.id;
const groupId = GMX_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumGmxFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
    @Inject(GmxContractFactory)
    private readonly gmxContractFactory: GmxContractFactory,
  ) {}

  async getPositions() {
    return this.singleStakingFarmContractPositionHelper.getContractPositions<GmxRewardTracker>({
      appId,
      groupId,
      network,
      dependencies: [
        { appId: GMX_DEFINITION.id, groupIds: [GMX_DEFINITION.groups.esGmx.id, GMX_DEFINITION.groups.glp.id], network },
      ],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) => this.gmxContractFactory.gmxRewardTracker({ network, address }),
      resolveIsActive: () => true,
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
