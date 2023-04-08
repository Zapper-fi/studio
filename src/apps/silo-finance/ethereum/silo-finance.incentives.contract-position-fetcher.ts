import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceIncentivesContractPositionfetcher } from '../common/silo-finance.incentives.contract-position-fetcher';

@PositionTemplate()
export class EthereumSiloFinanceIncentivesContractPositionfetcher extends SiloFinanceIncentivesContractPositionfetcher {
  groupLabel = 'Incentives';

  incentivesAddress = '0x6c1603ab6cecf89dd60c24530dde23f97da3c229';
}
