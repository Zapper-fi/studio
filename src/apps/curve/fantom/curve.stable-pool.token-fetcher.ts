import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolTokenFetcher } from '../common/curve.stable-pool.token-fetcher';

@PositionTemplate()
export class FantomCurveStablePoolTokenFetcher extends CurveStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x0f854ea9f38cea4b1c2fc79047e9d0134419d5d6';
}
