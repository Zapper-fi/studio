import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VendorFinancePoolV2ContractPositionFetcher } from '../common/vendor-finance.pool-v2.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumVendorFinancePoolV2ContractPositionFetcher extends VendorFinancePoolV2ContractPositionFetcher {
  groupLabel = 'Lending Pools V2';

  positionTrackerAddress = '0x93e73571a71d27cd35a20e14ba5b352c3c2236fc';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/forrestchew/graph-v2-v2';
}
