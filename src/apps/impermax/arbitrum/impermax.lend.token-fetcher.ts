import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ImpermaxLendTokenFetcher } from '../common/impermax.lend.token-fetcher';

@PositionTemplate()
export class ArbitrumImpermaxLendTokenFetcher extends ImpermaxLendTokenFetcher {
  groupLabel = 'Lending Pool';

  factoryAddress = '0x8c3736e2fe63cc2cd89ee228d9dbcab6ce5b767b';
}
