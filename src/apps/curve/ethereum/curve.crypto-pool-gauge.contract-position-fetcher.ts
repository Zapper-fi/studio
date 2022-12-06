import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class EthereumCurveCryptoPoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x8f942c20d02befc377d41445793068908e2250d0';
  crvTokenAddress = '0xd533a949740bb3306d119cc777fa900ba034cd52';
  controllerAddress = '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb';
}
