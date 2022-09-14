import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { MarketXyzSupplyTokenFetcher } from '../common/market-xyz.supply.token-fetcher';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

@Injectable()
export class AvalancheMarketXyzSupplyTokenFetcher extends MarketXyzSupplyTokenFetcher {
  appId = MARKET_XYZ_DEFINITION.id;
  groupId = MARKET_XYZ_DEFINITION.groups.supply.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Lending';

  lensAddress = '0x56563ab1740539983ff4d487ea3a3e47e23a19f9';
  poolDirectoryAddress = '0x1c4d63bda492d69f2d6b02fb622fb6c49cc401d2';
}
