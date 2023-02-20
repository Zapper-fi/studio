import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolTokenFetcher } from '../common/curve.stable-pool.token-fetcher';

@PositionTemplate()
export class ArbitrumCurveStablePoolTokenFetcher extends CurveStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x445fe580ef8d70ff569ab36e80c647af338db351';
}
