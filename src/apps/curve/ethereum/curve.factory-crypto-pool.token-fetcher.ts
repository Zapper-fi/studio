import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryCryptoPoolTokenFetcher } from '../common/curve.factory-crypto-pool.token-fetcher';

@PositionTemplate()
export class EthereumCurveFactoryCryptoPoolTokenFetcher extends CurveFactoryCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0xf18056bbd320e96a48e3fbf8bc061322531aac99';
}
