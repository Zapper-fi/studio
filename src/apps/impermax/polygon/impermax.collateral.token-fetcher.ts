import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ImpermaxCollateralTokenFetcher } from '../common/impermax.collateral.token-fetcher';

@PositionTemplate()
export class PolygonImpermaxCollateralTokenFetcher extends ImpermaxCollateralTokenFetcher {
  groupLabel = 'Lending Pool';

  factoryAddress = '0xbb92270716c8c424849f17ccc12f4f24ad4064d6';
}
