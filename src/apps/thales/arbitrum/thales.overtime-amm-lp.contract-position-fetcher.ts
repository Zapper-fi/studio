import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesOvertimeAmmLpContractPositionFetcher } from '../common/thales.overtime-amm-lp.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumThalesOvertimeAmmLpContractPositionFetcher extends ThalesOvertimeAmmLpContractPositionFetcher {
  contractAddress = '0x8e9018b48456202aa9bb3e485192b8475822b874';
}
