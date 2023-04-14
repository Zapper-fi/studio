import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesStakingContractPositionFetcher } from '../common/thales.staking.contract-position-fetcher';

@PositionTemplate()
export class OptimismThalesStakingContractPositionFetcher extends ThalesStakingContractPositionFetcher {
  contractAddress = '0xc392133eea695603b51a5d5de73655d571c2ce51';
}
