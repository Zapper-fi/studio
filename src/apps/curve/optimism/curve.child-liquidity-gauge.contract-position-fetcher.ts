import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveChildLiquidityGaugeContractPositionFetcher } from '../common/curve.child-liquidity-gauge.contract-position-fetcher';

@PositionTemplate()
export class OptimismCurveChildLiquidityGaugeContractPositionFetcher extends CurveChildLiquidityGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  factoryAddress = '0xabc000d88f23bb45525e447528dbf656a9d55bf5';
  crvTokenAddress = '0x0994206dfe8de6ec6920ff4d779b0d950605fb53';
}
