import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveChildLiquidityGaugeContractPositionFetcher } from '../common/curve.child-liquidity-gauge.contract-position-fetcher';

@PositionTemplate()
export class BaseCurveChildLiquidityGaugeContractPositionFetcher extends CurveChildLiquidityGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  factoryAddress = '0xabc000d88f23bb45525e447528dbf656a9d55bf5';
  crvTokenAddress = '0x8ee73c484a26e0a5df2ee2a4960b789967dd0415';
}
