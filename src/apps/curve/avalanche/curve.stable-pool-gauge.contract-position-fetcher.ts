import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class AvalancheCurveStablePoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6';
  crvTokenAddress = '0x47536f17f4ff30e64a96a7555826b8f9e66ec468';
}
