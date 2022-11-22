import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class OptimismCurveCryptoPoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x7da64233fefb352f8f501b357c018158ed8aa455';
  crvTokenAddress = '0x0994206dfe8de6ec6920ff4d779b0d950605fb53';
}
