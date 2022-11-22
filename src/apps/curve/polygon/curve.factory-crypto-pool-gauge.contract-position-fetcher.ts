import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryCryptoPoolGaugeContractPositionFetcher } from '../common/curve.factory-crypto-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class PolygonCurveFactoryCryptoPoolGaugeContractPositionFetcher extends CurveFactoryCryptoPoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0xe5de15a9c9bbedb4f5ec13b131e61245f2983a69';
  crvTokenAddress = '0x172370d5cd63279efa6d502dab29171933a610af';
}
