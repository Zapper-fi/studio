import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ExactlyRewardsFetcher } from '../common/exactly.rewards.contract-position-fetcher';

@PositionTemplate()
export class OptimismExactlyRewardsFetcher extends ExactlyRewardsFetcher {}
