import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { COSLEND_DEFINITION } from '../coslend.definition';
import { CoslendBorrowContractPositionHelper } from '../helper/coslend.borrow.contract-position-helper';

const appId = COSLEND_DEFINITION.id;
const groupId = COSLEND_DEFINITION.groups.borrow.id;
const network = Network.EVMOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EvmosCoslendBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CoslendBorrowContractPositionHelper)
    private readonly coslendBorrowContractPositionHelper: CoslendBorrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.coslendBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: COSLEND_DEFINITION.groups.supply.id,
    });
  }
}
