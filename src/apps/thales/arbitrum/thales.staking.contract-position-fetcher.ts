import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesStakingContractPositionFetcher } from '../common/thales.staking.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumThalesStakingContractPositionFetcher extends ThalesStakingContractPositionFetcher {
  contractAddress = '0x160ca569999601bca06109d42d561d85d6bb4b57';
}
