import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RevertFinanceCompoundorContractPositionFetcher } from '../common/revert-finance.compoundor.contract-position-fetcher';

@PositionTemplate()
export class OptimismRevertFinanceCompoundorContractPositionFetcher extends RevertFinanceCompoundorContractPositionFetcher {
  groupLabel = 'Compounding Positions';
  compoundorAddress = '0x5411894842e610c4d0f6ed4c232da689400f94a1';
}
