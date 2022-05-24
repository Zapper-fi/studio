import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundBorrowContractPositionHelper } from '~apps/compound/helper/compound.borrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

const appId = RARI_FUSE_DEFINITION.id;
const groupId = RARI_FUSE_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumRariFuseBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: RARI_FUSE_DEFINITION.groups.supply.id,
    });
  }
}
