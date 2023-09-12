import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryV2PoolTokenFetcher } from '../common/curve.factory-pool-v2.token-fetcher';

@PositionTemplate()
export class EthereumCurveTricryptoPoolTokenFetcher extends CurveFactoryV2PoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x0c0e5f2ff0ff18a3be9b835635039256dc4b4963';
}
