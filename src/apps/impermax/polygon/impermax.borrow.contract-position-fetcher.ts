import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundBorrowContractPositionHelper } from '~apps/compound';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxContractFactory } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.borrow.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class PolygonImpermaxBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundBorrowContractPositionHelper)
    private readonly compoundBorrowContractPositionHelper: CompoundBorrowContractPositionHelper,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  async getPositions() {
    return this.compoundBorrowContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      supplyGroupId: IMPERMAX_DEFINITION.groups.lend.id,
      resolveCashRaw: ({ multicall, address, network }) =>
        multicall.wrap(this.contractFactory.borrowable({ address, network })).totalBalance(),
    });
  }
}
