import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolGaugeContractPositionFetcher } from '../common/curve.factory-stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class AvalancheCurveFactoryStablePoolGaugeContractPositionFetcher extends CurveFactoryStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0xb17b674d9c5cb2e441f8e196a2f048a81355d031';
  crvTokenAddress = '0x47536f17f4ff30e64a96a7555826b8f9e66ec468';
}
