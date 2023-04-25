import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HiddenHandRewardsContractPositionFetcher } from '../common/hidden-hand.rewards.contract-position-fetcher';

@PositionTemplate()
export class EthereumHiddenHandRewardsContractPositionFetcher extends HiddenHandRewardsContractPositionFetcher {
  groupLabel: string = 'Ethereum Rewards';
}