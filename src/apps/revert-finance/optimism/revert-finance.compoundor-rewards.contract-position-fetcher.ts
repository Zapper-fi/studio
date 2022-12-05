import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RevertFinanceCompoundorRewardsContractPositionFetcher } from '../common/revert-finance.compoundor-rewards.contract-position-fetcher';

@PositionTemplate()
export class OptimismRevertFinanceCompoundorRewardsContractPositionFetcher extends RevertFinanceCompoundorRewardsContractPositionFetcher {
  groupLabel = 'Compoundor Rewards';
  compoundorAddress = '0x5411894842e610c4d0f6ed4c232da689400f94a1';
}
