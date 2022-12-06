import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveChildLiquidityGaugeContractPositionFetcher } from '../common/curve.child-liquidity-gauge.contract-position-fetcher';

@PositionTemplate()
export class GnosisCurveChildLiquidityGaugeContractPositionFetcher extends CurveChildLiquidityGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  factoryAddress = '0xabc000d88f23bb45525e447528dbf656a9d55bf5';
  crvTokenAddress = '0x712b3d230f3c1c19db860d80619288b1f0bdd0bd';
}
