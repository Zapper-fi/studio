import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AcrossStakingContractPositionFetcher } from '../common/across.staking.contract-position-fetcher';

@PositionTemplate()
export class EthereumStakingContractPositionFetcher extends AcrossStakingContractPositionFetcher {
  groupLabel = 'Rewards';

  acceleratingDistributorAddress = '0x9040e41ef5e8b281535a96d9a48acb8cfabd9a48';
}
