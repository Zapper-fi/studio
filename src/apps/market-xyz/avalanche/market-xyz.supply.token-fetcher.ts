import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MarketXyzSupplyTokenFetcher } from '../common/market-xyz.supply.token-fetcher';

@PositionTemplate()
export class AvalancheMarketXyzSupplyTokenFetcher extends MarketXyzSupplyTokenFetcher {
  groupLabel = 'Lending';

  lensAddress = '0x56563ab1740539983ff4d487ea3a3e47e23a19f9';
  poolDirectoryAddress = '0x1c4d63bda492d69f2d6b02fb622fb6c49cc401d2';
}
