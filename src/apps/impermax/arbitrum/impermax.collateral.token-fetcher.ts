import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ImpermaxCollateralTokenFetcher } from '../common/impermax.collateral.token-fetcher';

@PositionTemplate()
export class ArbitrumImpermaxCollateralTokenFetcher extends ImpermaxCollateralTokenFetcher {
  groupLabel = 'Lending Pool';

  factoryAddress = '0x8c3736e2fe63cc2cd89ee228d9dbcab6ce5b767b';
}
