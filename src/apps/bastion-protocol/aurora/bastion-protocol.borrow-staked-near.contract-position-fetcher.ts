import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionBorrowContractPositionHelper } from '../helper/bastion-protocol.borrow.contract-position-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.borrowStakedNear.id;
const network = Network.AURORA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolBorrowStakedNearContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(BastionBorrowContractPositionHelper)
    private readonly bastionBorrowContractPositionHelper: BastionBorrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.bastionBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: BASTION_PROTOCOL_DEFINITION.groups.supplyStakedNear.id,
    });
  }
}
