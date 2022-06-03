import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundBorrowContractPositionHelper } from '~apps/compound';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { COZY_FINANCE_DEFINITION } from '../cozy-finance.definition';

const appId = COZY_FINANCE_DEFINITION.id;
const groupId = COZY_FINANCE_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumCozyFinanceBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: COZY_FINANCE_DEFINITION.groups.supply.id,
    });
  }
}
