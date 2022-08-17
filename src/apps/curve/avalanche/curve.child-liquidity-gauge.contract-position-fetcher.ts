import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { CurveChildLiquidityGaugeContractPositionFetcher } from '../common/curve.child-liquidity-gauge.contract-position-fetcher';
import { CURVE_DEFINITION } from '../curve.definition';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.childLiquidityGauge.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheCurveChildLiquidityGaugeContractPositionFetcher extends CurveChildLiquidityGaugeContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
}
