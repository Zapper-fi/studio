import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class FantomCurveStablePoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x0f854ea9f38cea4b1c2fc79047e9d0134419d5d6';
  crvTokenAddress = '0x1e4f97b9f9f913c46f1632781732927b9019c68b';
}
