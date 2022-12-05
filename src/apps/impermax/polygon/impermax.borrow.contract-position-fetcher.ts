import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ImpermaxBorrowContractPositionFetcher } from '../common/impermax.borrow.contract-position-fetcher';

@PositionTemplate()
export class PolygonImpermaxBorrowContractPositionFetcher extends ImpermaxBorrowContractPositionFetcher {
  groupLabel = 'Lending Pool';

  factoryAddress = '0xbb92270716c8c424849f17ccc12f4f24ad4064d6';
}
