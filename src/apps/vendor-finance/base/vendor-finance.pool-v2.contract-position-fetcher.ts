import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VendorFinancePoolV2ContractPositionFetcher } from '../common/vendor-finance.pool-v2.contract-position-fetcher';

@PositionTemplate()
export class BaseVendorFinancePoolV2ContractPositionFetcher extends VendorFinancePoolV2ContractPositionFetcher {
  groupLabel = 'Lending Pools V2';

  positionTrackerAddr = '0x37D2f55F34f3F7D5A7Deb0367915e5ab4aC15193';
  entityUrl = 'https://us-central1-vendor-finace.cloudfunctions.net/getEntitiesFromSubgraph';
}
