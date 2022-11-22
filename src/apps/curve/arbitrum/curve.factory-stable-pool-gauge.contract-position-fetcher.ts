import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolGaugeContractPositionFetcher } from '../common/curve.factory-stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumCurveFactoryStablePoolGaugeContractPositionFetcher extends CurveFactoryStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0xb17b674d9c5cb2e441f8e196a2f048a81355d031';
  crvTokenAddress = '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978';
}
