import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveChildLiquidityGaugeContractPositionFetcher } from '../common/curve.child-liquidity-gauge.contract-position-fetcher';

@PositionTemplate()
export class PolygonCurveChildLiquidityGaugeContractPositionFetcher extends CurveChildLiquidityGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  factoryAddress = '0xabc000d88f23bb45525e447528dbf656a9d55bf5';
  crvTokenAddress = '0x172370d5cd63279efa6d502dab29171933a610af';
}
