import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundBorrowContractPositionHelper } from '~apps/compound/helper/compound.borrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IRON_BANK_DEFINITION } from '../iron-bank.definition';

const appId = IRON_BANK_DEFINITION.id;
const groupId = IRON_BANK_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumIronBankBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: IRON_BANK_DEFINITION.groups.supply.id,
    });
  }
}
