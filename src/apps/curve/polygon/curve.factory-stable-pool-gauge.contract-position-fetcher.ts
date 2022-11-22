import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolGaugeContractPositionFetcher } from '../common/curve.factory-stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class PolygonCurveFactoryStablePoolGaugeContractPositionFetcher extends CurveFactoryStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x722272d36ef0da72ff51c5a65db7b870e2e8d4ee';
  crvTokenAddress = '0x172370d5cd63279efa6d502dab29171933a610af';
}
