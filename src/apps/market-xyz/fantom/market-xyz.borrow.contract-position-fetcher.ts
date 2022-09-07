import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { MarketXyzBorrowContractPositionFetcher } from '../common/market-xyz.borrow.contract-position-fetcher';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

@Injectable()
export class FantomMarketXyzBorrowContractPositionFetcher extends MarketXyzBorrowContractPositionFetcher {
  appId = MARKET_XYZ_DEFINITION.id;
  groupId = MARKET_XYZ_DEFINITION.groups.borrow.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending';

  lensAddress = '0x5ab6215ab8344c28b899efde93bee47b124200fb';
  poolDirectoryAddress = '0x0e7d754a8d1a82220432148c10715497a0569bd7';
}
