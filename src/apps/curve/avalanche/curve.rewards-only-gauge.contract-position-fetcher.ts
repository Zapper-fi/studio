import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { CurveRewardsOnlyGaugeContractPositionFetcher } from '../common/curve.rewards-only-gauge.contract-position-fetcher';
import { CURVE_DEFINITION } from '../curve.definition';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.rewardsOnlyGauge.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheCurveRewardsOnlyGaugeContractPositionFetcher extends CurveRewardsOnlyGaugeContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
}
