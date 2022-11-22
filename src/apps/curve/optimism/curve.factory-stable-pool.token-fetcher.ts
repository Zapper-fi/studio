import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolTokenFetcher } from '../common/curve.factory-stable-pool.token-fetcher';

@PositionTemplate()
export class OptimismCurveFactoryStablePoolTokenFetcher extends CurveFactoryStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x2db0e83599a91b508ac268a6197b8b14f5e72840';
}
