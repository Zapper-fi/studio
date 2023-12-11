import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryV2PoolTokenFetcher } from '../common/curve.factory-pool-v2.token-fetcher';

@PositionTemplate()
export class BaseCurveTricryptoPoolTokenFetcher extends CurveFactoryV2PoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0xa5961898870943c68037f6848d2d866ed2016bcb';
}
