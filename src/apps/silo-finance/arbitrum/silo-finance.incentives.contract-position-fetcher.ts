import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceIncentivesContractPositionfetcher } from '../common/silo-finance.incentives.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumSiloFinanceIncentivesContractPositionfetcher extends SiloFinanceIncentivesContractPositionfetcher {
  groupLabel = 'Incentives';

  incentivesAddress = '0x4999873bf8741bfffb0ec242aaaa7ef1fe74fce8';
}
