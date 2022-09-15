import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { OpenleveragePoolTokenFetcher } from '../common/openleverage.pool.token-fetcher';
import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';

@Injectable()
export class BinanceSmartChainOpenleveragePoolTokenFetcher extends OpenleveragePoolTokenFetcher {
  appId = OPENLEVERAGE_DEFINITION.id;
  groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Pools';

  subgraphUrl = `https://api.thegraph.com/subgraphs/name/openleveragedev/openleverage-bsc`;
}
