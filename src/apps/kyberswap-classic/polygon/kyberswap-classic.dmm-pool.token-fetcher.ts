import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicPoolTokenFetcher } from '../common/kyberswap-classic.pool.token-fetcher';

@PositionTemplate()
export class PolygonKyberSwapDmmClassicPoolTokenFetcher extends KyberSwapClassicPoolTokenFetcher {
  groupLabel = 'DMM Pools';
  factoryAddress = '0x5f1fe642060b5b9658c15721ea22e982643c095c';
}
