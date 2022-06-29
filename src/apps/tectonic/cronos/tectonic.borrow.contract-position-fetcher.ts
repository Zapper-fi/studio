import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundBorrowContractPositionHelper } from '~apps/compound';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TECTONIC_DEFINITION } from '../tectonic.definition';

const appId = TECTONIC_DEFINITION.id;
const groupId = TECTONIC_DEFINITION.groups.borrow.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class CronosTectonicBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly borrowContractPositionHelper: CompoundBorrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.borrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: TECTONIC_DEFINITION.groups.supply.id,
    });
  }
}
