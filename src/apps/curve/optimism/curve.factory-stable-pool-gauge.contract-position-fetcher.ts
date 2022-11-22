import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolGaugeContractPositionFetcher } from '../common/curve.factory-stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class OptimismCurveFactoryStablePoolGaugeContractPositionFetcher extends CurveFactoryStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x2db0e83599a91b508ac268a6197b8b14f5e72840';
  crvTokenAddress = '0x0994206dfe8de6ec6920ff4d779b0d950605fb53';
}
