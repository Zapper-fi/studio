import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VendorFinancePoolV2ContractPositionFetcher } from '../common/vendor-finance.pool-v2.contract-position-fetcher';

@PositionTemplate()
export class EthereumVendorFinancePoolV2ContractPositionFetcher extends VendorFinancePoolV2ContractPositionFetcher {
  groupLabel = 'Lending Pools';

  entityUrl = 'https://us-central1-vendor-finace.cloudfunctions.net/getEntitiesFromSubgraph';
}
