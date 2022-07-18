import { Inject } from '@nestjs/common';
import { flatten } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TRADER_JOE_DEFINITION } from '~apps/trader-joe';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SteakHutContractFactory, SteakHutStaking } from '../contracts';
import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

const appId = STEAK_HUT_DEFINITION.id;
const groupId = STEAK_HUT_DEFINITION.groups.staking.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheSteakHutStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) private readonly contractFactory: SteakHutContractFactory,
  ) {}

  async getSingleStakingPosition(address: string) {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<SteakHutStaking>({
      appId,
      groupId,
      network,
      dependencies: [
        { appId, groupIds: [STEAK_HUT_DEFINITION.groups.ve.id], network },
        { appId: TRADER_JOE_DEFINITION.id, groupIds: [TRADER_JOE_DEFINITION.groups.xJoe.id], network },
      ],
      resolveFarmAddresses: async () => [address],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).inputToken(),
      resolveFarmContract: opts => this.contractFactory.steakHutStaking(opts),
      resolveRewardTokenAddresses: async ({ multicall, contract }) => multicall.wrap(contract).rewardToken(),
      resolveIsActive: async ({ multicall, contract }) => multicall.wrap(contract).isRewarderEnabled(),
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }), // TODO: calculated based on tokenPerSec
    });
  }

  async getHJoePositions() {
    return this.getSingleStakingPosition('0x4E664284B7fbD10633768D59c17D959D9cB8deE2'.toLowerCase());
  }

  async getSteakPosition() {
    return this.getSingleStakingPosition('0x1f6866E1A684247886545503F8E6e76e328aDE34'.toLowerCase());
  }

  async getPositions() {
    const positions = await Promise.all([this.getHJoePositions(), this.getSteakPosition()]);
    return flatten(positions);
  }
}
