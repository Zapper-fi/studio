import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundBorrowContractPositionHelper } from '~apps/compound/helper/compound.borrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TarotContractFactory } from '../contracts';
import { TAROT_DEFINITION } from '../tarot.definition';

const appId = TAROT_DEFINITION.id;
const groupId = TAROT_DEFINITION.groups.borrow.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomTarotBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
    @Inject(TarotContractFactory) private readonly tarotContractFactory: TarotContractFactory,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: TAROT_DEFINITION.groups.supply.id,
      resolveCashRaw: ({ multicall, address, network }) =>
        multicall.wrap(this.tarotContractFactory.tarotBorrowable({ address, network })).totalBalance(),
    });
  }
}
