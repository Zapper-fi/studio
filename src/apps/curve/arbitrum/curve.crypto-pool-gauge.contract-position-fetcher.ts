import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumCurveCryptoPoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x0e9fbb167df83ede3240d6a5fa5d40c6c6851e15';
  crvTokenAddress = '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978';
}
