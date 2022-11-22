import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolTokenFetcher } from '../common/curve.stable-pool.token-fetcher';

@PositionTemplate()
export class PolygonCurveStablePoolTokenFetcher extends CurveStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x094d12e5b541784701fd8d65f11fc0598fbc6332';
}
