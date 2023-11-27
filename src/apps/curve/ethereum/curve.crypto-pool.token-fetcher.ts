import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveCryptoPoolTokenFetcher } from '../common/curve.crypto-pool.token-fetcher';

@PositionTemplate()
export class EthereumCurveCryptoPoolTokenFetcher extends CurveCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x8f942c20d02befc377d41445793068908e2250d0';

  blacklistedSwapAddresses = ['0xed4064f376cb8d68f770fb1ff088a3d0f3ff5c4d'];
}
