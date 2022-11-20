import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class EthereumCurveStablePoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5';
  crvTokenAddress = '0xd533a949740bb3306d119cc777fa900ba034cd52';
  controllerAddress = '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb';
}
