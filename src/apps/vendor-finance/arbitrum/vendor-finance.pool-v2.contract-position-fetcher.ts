import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VendorFinancePoolV2ContractPositionFetcher } from '../common/vendor-finance.pool-v2.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumVendorFinancePoolV2ContractPositionFetcher extends VendorFinancePoolV2ContractPositionFetcher {
  groupLabel = 'Lending Pools V2';

  entityUrl = 'https://us-central1-vendor-finace.cloudfunctions.net/getEntitiesFromSubgraph';
}
