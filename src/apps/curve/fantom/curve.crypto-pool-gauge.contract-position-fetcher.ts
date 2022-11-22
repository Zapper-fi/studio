import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class FantomCurveCryptoPoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x4fb93d7d320e8a263f22f62c2059dfc2a8bcbc4c';
  crvTokenAddress = '0x1e4f97b9f9f913c46f1632781732927b9019c68b';
}
