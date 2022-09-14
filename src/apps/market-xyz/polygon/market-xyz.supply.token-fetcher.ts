import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { MarketXyzSupplyTokenFetcher } from '../common/market-xyz.supply.token-fetcher';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

@Injectable()
export class PolygonMarketXyzSupplyTokenFetcher extends MarketXyzSupplyTokenFetcher {
  appId = MARKET_XYZ_DEFINITION.id;
  groupId = MARKET_XYZ_DEFINITION.groups.supply.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Lending';

  lensAddress = '0xe4d84b252308645098846312286e6c6d2846dbb0';
  poolDirectoryAddress = '0xa2a1cb88d86a939a37770fe5e9530e8700dee56b';
}
