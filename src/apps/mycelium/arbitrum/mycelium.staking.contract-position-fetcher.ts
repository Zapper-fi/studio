import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumStakingContractPositionHelper } from '../helpers/mycelium.staking.contract-position-helper';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.staking.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumMyceliumStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MyceliumStakingContractPositionHelper)
    private readonly myceliumStakingContractHelper: MyceliumStakingContractPositionHelper,
  ) {}

  async getPositions() {
    return this.myceliumStakingContractHelper.getPosition({ network });
  }
}
