import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CompoundBorrowContractPositionHelper } from '../../tarot/helper/compound.borrow.contract-position-helper'; // TODO: move to compound folder
import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumImpermaxBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions<Borrowable>({
      network,
      appId,
      groupId,
      supplyGroupId: IMPERMAX_DEFINITION.groups.lend.id,
      resolveContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      resolveCashRaw: ({ multicall, contract }) => multicall.wrap(contract).totalBalance(),
    });
  }
}
