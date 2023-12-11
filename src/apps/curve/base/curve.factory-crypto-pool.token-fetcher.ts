import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryCryptoPoolTokenFetcher } from '../common/curve.factory-crypto-pool.token-fetcher';

@PositionTemplate()
export class BaseCurveFactoryCryptoPoolTokenFetcher extends CurveFactoryCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x5ef72230578b3e399e6c6f4f6360edf95e83bbfd';
}
