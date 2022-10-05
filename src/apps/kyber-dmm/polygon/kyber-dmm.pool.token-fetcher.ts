import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberDmmPoolTokenFetcher } from '../common/kyber-dmm.pool.token-fetcher';

@PositionTemplate()
export class PolygonKyberDmmPoolTokenFetcher extends KyberDmmPoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x5f1fe642060b5b9658c15721ea22e982643c095c';
}
