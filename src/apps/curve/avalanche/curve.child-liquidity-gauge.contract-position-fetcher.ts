import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveChildLiquidityGaugeContractPositionFetcher } from '../common/curve.child-liquidity-gauge.contract-position-fetcher';

@PositionTemplate()
export class AvalancheCurveChildLiquidityGaugeContractPositionFetcher extends CurveChildLiquidityGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  factoryAddress = '0xabc000d88f23bb45525e447528dbf656a9d55bf5';
  crvTokenAddress = '0x47536f17f4ff30e64a96a7555826b8f9e66ec468';
}
