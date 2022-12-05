import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolTokenFetcher } from '../common/curve.stable-pool.token-fetcher';

@PositionTemplate()
export class EthereumCurveStablePoolTokenFetcher extends CurveStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5';
}
