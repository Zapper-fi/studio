import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveCryptoPoolTokenFetcher } from '../common/curve.crypto-pool.token-fetcher';

@PositionTemplate()
export class FantomCurveCryptoPoolTokenFetcher extends CurveCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x4fb93d7d320e8a263f22f62c2059dfc2a8bcbc4c';
}
