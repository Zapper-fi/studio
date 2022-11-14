import { Inject } from '@nestjs/common';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MuxContractFactory, MuxRewardTracker } from '../contracts';
import { MUX_DEFINITION } from '../mux.definition';

export const MLP_FARM = {
  address: '0x290450cdea757c68e4fe6032ff3886d204292914',
  stakedTokenAddress: '0x7cbaf5a14d953ff896e5b3312031515c858737c8',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

export const MCB_FARM = {
  address: '0xa65ba125a25b51539a3d10910557b28215097810',
  stakedTokenAddress: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

export const MUX_FARM = {
  address: '0xa65ba125a25b51539a3d10910557b28215097810',
  stakedTokenAddress: '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

export const FARMS = [MLP_FARM, MCB_FARM, MUX_FARM];


const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumMuxFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly muxContractFactory: MuxContractFactory,
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
  ) {}

  async getPositions() {
    return this.singleStakingFarmContractPositionHelper.getContractPositions<MuxRewardTracker>({
      appId,
      groupId,
      network,
      dependencies: [
        { appId: MUX_DEFINITION.id, groupIds: [MUX_DEFINITION.groups.mlp.id, MUX_DEFINITION.groups.mux.id], network },
      ],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) => this.muxContractFactory.muxRewardTracker({ network, address }),
      resolveIsActive: () => true,
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
