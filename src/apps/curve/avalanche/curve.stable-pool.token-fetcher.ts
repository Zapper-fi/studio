import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolTokenFetcher } from '../common/curve.stable-pool.token-fetcher';

@PositionTemplate()
export class AvalancheCurveStablePoolTokenFetcher extends CurveStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6';
}
