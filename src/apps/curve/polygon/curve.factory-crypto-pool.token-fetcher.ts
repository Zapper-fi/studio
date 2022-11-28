import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryCryptoPoolTokenFetcher } from '../common/curve.factory-crypto-pool.token-fetcher';

@PositionTemplate()
export class PolygonCurveFactoryCryptoPoolTokenFetcher extends CurveFactoryCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0xe5de15a9c9bbedb4f5ec13b131e61245f2983a69';
}
