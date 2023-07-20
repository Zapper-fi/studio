import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryV2PoolTokenFetcher } from '../common/curve.factory-pool-v2.token-fetcher';

@PositionTemplate()
export class EthereumCurveCrvUsdPoolTokenFetcher extends CurveFactoryV2PoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x4f8846ae9380b90d2e71d5e3d042dff3e7ebb40d';
}
