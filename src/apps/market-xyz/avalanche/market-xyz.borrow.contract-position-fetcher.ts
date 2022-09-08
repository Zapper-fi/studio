import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { MarketXyzBorrowContractPositionFetcher } from '../common/market-xyz.borrow.contract-position-fetcher';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

@Injectable()
export class AvalancheMarketXyzBorrowContractPositionFetcher extends MarketXyzBorrowContractPositionFetcher {
  appId = MARKET_XYZ_DEFINITION.id;
  groupId = MARKET_XYZ_DEFINITION.groups.borrow.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Lending';

  lensAddress = '0x56563ab1740539983ff4d487ea3a3e47e23a19f9';
  poolDirectoryAddress = '0x1c4d63bda492d69f2d6b02fb622fb6c49cc401d2';
}
