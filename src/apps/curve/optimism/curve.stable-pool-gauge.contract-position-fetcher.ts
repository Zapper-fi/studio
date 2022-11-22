import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class OptimismCurveStablePoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0xc5cfada84e902ad92dd40194f0883ad49639b023';
  crvTokenAddress = '0x0994206dfe8de6ec6920ff4d779b0d950605fb53';
}
