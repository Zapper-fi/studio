import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VendorFinancePoolContractPositionFetcher } from '../common/vendor-finance.pool.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumVendorFinancePoolContractPositionFetcher extends VendorFinancePoolContractPositionFetcher {
  groupLabel = 'Lending Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/0xtaiga/vendor-finance';
}
