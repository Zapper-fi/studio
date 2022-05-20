import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TarotBorrowable, TarotContractFactory } from '../contracts';
import { CompoundBorrowContractPositionHelper } from '../helper/compound.borrow.contract-position-helper';
import { TAROT_DEFINITION } from '../tarot.definition';

const appId = TAROT_DEFINITION.id;
const groupId = TAROT_DEFINITION.groups.borrow.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomTarotBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
    @Inject(TarotContractFactory)
    private readonly tarotContractFactory: TarotContractFactory,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions<TarotBorrowable>({
      network,
      appId,
      groupId,
      supplyGroupId: TAROT_DEFINITION.groups.supply.id,
      resolveContract: ({ address, network }) => this.tarotContractFactory.tarotBorrowable({ address, network }),
      resolveCashRaw: ({ multicall, contract }) => multicall.wrap(contract).totalBalance(),
    });
  }
}
