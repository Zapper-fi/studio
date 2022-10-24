import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapDmmPoolTokenFetcher } from '../common/kyberswap-dmm.pool.token-fetcher';

@PositionTemplate()
export class PolygonKyberSwapDmmPoolTokenFetcher extends KyberSwapDmmPoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x5f1fe642060b5b9658c15721ea22e982643c095c';
}
