import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class PolygonCurveCryptoPoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x47bb542b9de58b970ba50c9dae444ddb4c16751a';
  crvTokenAddress = '0x172370d5cd63279efa6d502dab29171933a610af';
}
