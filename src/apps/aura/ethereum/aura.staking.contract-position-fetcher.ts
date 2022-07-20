import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AuraBaseRewardPoolHelper } from '~apps/aura/helpers/aura.base-reward-pool-helper';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';
import { AuraContractFactory } from '../contracts';

const appId = AURA_DEFINITION.id;
const groupId = AURA_DEFINITION.groups.staking.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAuraStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly auraContractFactory: AuraContractFactory,
    @Inject(AuraBaseRewardPoolHelper) private readonly auraBaseRewardPoolHelper: AuraBaseRewardPoolHelper,
  ) {}

  async getPositions() {
    return this.auraBaseRewardPoolHelper.getBaseRewardPoolContractPositions({
      appId,
      network,
      groupId,
      dependencies: [
        { appId: BALANCER_V2_DEFINITION.id, network, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id] },
        { appId, network, groupIds: [groupId, AURA_DEFINITION.groups.chef.id] },
      ],
      rewardPools: ['0x5e5ea2048475854a5702f5b8468a51ba1296efcc'],
    });
  }
}
