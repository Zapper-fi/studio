import { Inject } from '@nestjs/common';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GmxContractFactory, GmxRewardTracker } from '../contracts';
import GMX_DEFINITION from '../gmx.definition';

export const GMX_FARM = {
  address: '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342',
  stakedTokenAddress: '0x62edc0692bd897d2295872a9ffcac5425011c661',
  rewardTokenAddresses: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', '0xff1489227bbaac61a9209a08929e4c2a526ddd17'],
  rewardTrackerAddresses: ['0x4d268a7d4c16ceb5a606c173bd974984343fea13', '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342'],
};

export const ES_GMX_FARM = {
  address: '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342',
  stakedTokenAddress: '0xff1489227bbaac61a9209a08929e4c2a526ddd17',
  rewardTokenAddresses: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', '0xff1489227bbaac61a9209a08929e4c2a526ddd17'],
  rewardTrackerAddresses: [],
};

export const GLP_FARM = {
  address: '0xd2d1162512f927a7e282ef43a362659e4f2a728f',
  stakedTokenAddress: '0x01234181085565ed162a948b6a5e88758cd7c7b8',
  rewardTokenAddresses: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', '0xff1489227bbaac61a9209a08929e4c2a526ddd17'],
  rewardTrackerAddresses: ['0xd2d1162512f927a7e282ef43a362659e4f2a728f', '0x9e295b5b976a184b14ad8cd72413ad846c299660'],
};

export const FARMS = [GMX_FARM, ES_GMX_FARM, GLP_FARM];

const appId = GMX_DEFINITION.id;
const groupId = GMX_DEFINITION.groups.glp.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheGmxFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
