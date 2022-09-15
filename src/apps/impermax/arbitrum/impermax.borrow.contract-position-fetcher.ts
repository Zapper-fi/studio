import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ImpermaxBorrowContractPositionFetcher } from '../common/impermax.borrow.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumImpermaxBorrowContractPositionFetcher extends ImpermaxBorrowContractPositionFetcher {
  groupLabel = 'Lending Pool';

  factoryAddress = '0x8c3736e2fe63cc2cd89ee228d9dbcab6ce5b767b';
}
