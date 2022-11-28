import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryCryptoPoolGaugeContractPositionFetcher } from '../common/curve.factory-crypto-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class EthereumCurveFactoryCryptoPoolGaugeContractPositionFetcher extends CurveFactoryCryptoPoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0xf18056bbd320e96a48e3fbf8bc061322531aac99';
  crvTokenAddress = '0xd533a949740bb3306d119cc777fa900ba034cd52';
  controllerAddress = '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb';
}
