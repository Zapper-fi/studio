import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MarketXyzSupplyTokenFetcher } from '../common/market-xyz.supply.token-fetcher';

@PositionTemplate()
export class FantomMarketXyzSupplyTokenFetcher extends MarketXyzSupplyTokenFetcher {
  groupLabel = 'Lending';

  lensAddress = '0x5ab6215ab8344c28b899efde93bee47b124200fb';
  poolDirectoryAddress = '0x0e7d754a8d1a82220432148c10715497a0569bd7';
}
