import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3ClaimableContractPositionFetcher } from '../common/pool-together-v3.claimable.contract-position-fetcher';

@PositionTemplate()
export class PolygonPoolTogetherV3ClaimableContractPositionFetcher extends PoolTogetherV3ClaimableContractPositionFetcher {
  groupLabel = 'Rewards';
  isExcludedFromExplore = true;
}
