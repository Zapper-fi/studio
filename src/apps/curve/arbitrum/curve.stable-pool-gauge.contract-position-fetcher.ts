import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumCurveStablePoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x445fe580ef8d70ff569ab36e80c647af338db351';
  crvTokenAddress = '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978';
}
