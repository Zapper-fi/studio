import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolTokenFetcher } from '../common/curve.factory-stable-pool.token-fetcher';

@PositionTemplate()
export class EthereumCurveFactoryStablePoolTokenFetcher extends CurveFactoryStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0xb9fc157394af804a3578134a6585c0dc9cc990d4';
}
