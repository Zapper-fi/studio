import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveCryptoPoolTokenFetcher } from '../common/curve.crypto-pool.token-fetcher';

@PositionTemplate()
export class ArbitrumCurveCryptoPoolTokenFetcher extends CurveCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x0e9fbb167df83ede3240d6a5fa5d40c6c6851e15';
}
