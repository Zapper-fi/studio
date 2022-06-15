import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundBorrowContractPositionHelper } from '~apps/compound';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURIGAMI_DEFINITION } from '../aurigami.definition';

const appId = AURIGAMI_DEFINITION.id;
const groupId = AURIGAMI_DEFINITION.groups.borrow.id;
const network = Network.AURORA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraAurigamiBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: AURIGAMI_DEFINITION.groups.supply.id,
    });
  }
}
