import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VendorFinancePoolContractPositionFetcher } from '../common/vendor-finance.pool.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumVendorFinancePoolContractPositionFetcher extends VendorFinancePoolContractPositionFetcher {
  groupLabel = 'Lending Pools';

  entityUrl = 'https://us-central1-vendor-finace.cloudfunctions.net/getEntitiesFromSubgraph';
}
