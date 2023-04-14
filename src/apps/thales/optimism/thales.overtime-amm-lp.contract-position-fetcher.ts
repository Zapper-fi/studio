import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesOvertimeAmmLpContractPositionFetcher } from '../common/thales.overtime-amm-lp.contract-position-fetcher';

@PositionTemplate()
export class OptimismThalesOvertimeAmmLpContractPositionFetcher extends ThalesOvertimeAmmLpContractPositionFetcher {
  contractAddress = '0x842e89b7a7ef8ce099540b3613264c933ce0eba5';
}
