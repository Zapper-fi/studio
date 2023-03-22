import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceSiloContractPositionFetcher } from '../common/silo-finance.silo.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumSiloFinanceSiloContractPositionFetcher extends SiloFinanceSiloContractPositionFetcher {
  groupLabel = 'Silos';

  siloLensAddress = '0x2dd3fb3d8aabdeca8571bf5d5cc2969cb563a6e9';
}
