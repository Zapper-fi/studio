import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GainsNetworkStakingV2ContractPositionFetcher } from '../common/gains-network.staking-v2.contract-position-fetcher';

@PositionTemplate()
export class PolygonGainsNetworkStakingV2ContractPositionFetcher extends GainsNetworkStakingV2ContractPositionFetcher {
  groupLabel = 'Staking';

  stakingContractAddress = '0x8c74b2256ffb6705f14ada8e86fbd654e0e2beca';
}
