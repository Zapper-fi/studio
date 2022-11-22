import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class GnosisCurveStablePoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x55e91365697eb8032f98290601847296ec847210';
  crvTokenAddress = '0x712b3d230f3c1c19db860d80619288b1f0bdd0bd';
}
