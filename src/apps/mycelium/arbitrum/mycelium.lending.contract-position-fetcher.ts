import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumLendingContractPositionHelper } from '../helpers/mycelium.lending.contract-position-helper';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.lending.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumMyceliumLendingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MyceliumLendingContractPositionHelper)
    private readonly myceliumLendingContractHelper: MyceliumLendingContractPositionHelper,
  ) {}

  async getPositions() {
    return this.myceliumLendingContractHelper.getPosition({ network });
  }
}
