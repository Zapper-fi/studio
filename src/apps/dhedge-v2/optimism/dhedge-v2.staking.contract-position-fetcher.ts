import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DhedgeV2StakingContractPositionFetcher } from '../common/dhedge-v2.staking.contract-position-fetcher';

@PositionTemplate()
export class OptimismDhedgeV2StakingContractPositionFetcher extends DhedgeV2StakingContractPositionFetcher {
  groupLabel = ' Staking';

  stakingV2ContractAddress = '0xf165ca3d75120d817b7428eef8c39ea5cb33b612';
}
