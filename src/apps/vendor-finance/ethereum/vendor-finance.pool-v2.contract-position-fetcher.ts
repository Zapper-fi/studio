import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VendorFinancePoolV2ContractPositionFetcher } from '../common/vendor-finance.pool-v2.contract-position-fetcher';

@PositionTemplate()
export class EthereumVendorFinancePoolV2ContractPositionFetcher extends VendorFinancePoolV2ContractPositionFetcher {
  groupLabel = 'Lending Pools V2';

  positionTrackerAddr = '0x6eb1775410642cdf4ba2dcf2fdaef4d0bbd08652';
  entityUrl = 'https://us-central1-vendor-finace.cloudfunctions.net/getEntitiesFromSubgraph';
}
