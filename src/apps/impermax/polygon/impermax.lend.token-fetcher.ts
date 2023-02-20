import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ImpermaxLendTokenFetcher } from '../common/impermax.lend.token-fetcher';

@PositionTemplate()
export class PolygonImpermaxLendTokenFetcher extends ImpermaxLendTokenFetcher {
  groupLabel = 'Lending Pool';

  factoryAddress = '0xbb92270716c8c424849f17ccc12f4f24ad4064d6';
}
