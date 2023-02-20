import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolGaugeContractPositionFetcher } from '../common/curve.factory-stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class EthereumCurveFactoryStablePoolGaugeContractPositionFetcher extends CurveFactoryStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0xb9fc157394af804a3578134a6585c0dc9cc990d4';
  crvTokenAddress = '0xd533a949740bb3306d119cc777fa900ba034cd52';
  controllerAddress = '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb';
}
