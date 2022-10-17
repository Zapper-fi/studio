import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MarketXyzSupplyTokenFetcher } from '../common/market-xyz.supply.token-fetcher';

@PositionTemplate()
export class PolygonMarketXyzSupplyTokenFetcher extends MarketXyzSupplyTokenFetcher {
  groupLabel = 'Lending';

  lensAddress = '0xe4d84b252308645098846312286e6c6d2846dbb0';
  poolDirectoryAddress = '0xa2a1cb88d86a939a37770fe5e9530e8700dee56b';
}
