import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HiddenHandRewardsContractPositionFetcher } from '../common/hidden-hand.rewards.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumHiddenHandRewardsContractPositionFetcher extends HiddenHandRewardsContractPositionFetcher {
  groupLabel = 'Arbitrum Rewards';
}
