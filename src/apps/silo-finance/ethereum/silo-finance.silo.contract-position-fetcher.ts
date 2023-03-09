import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceSiloContractPositionFetcher } from '../common/silo-finance.silo.contract-position-fetcher';

@PositionTemplate()
export class EthereumSiloFinanceSiloContractPositionFetcher extends SiloFinanceSiloContractPositionFetcher {
  groupLabel = 'Silos';

  siloLensAddress = '0xf12c3758c1ec393704f0db8537ef7f57368d92ea';
}
