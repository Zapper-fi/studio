import { Injectable } from '@nestjs/common';

import { UniswapV2PoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.subgraph.template.token-fetcher';
import { Network } from '~types/network.interface';

import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

@Injectable()
export class AvalancheTraderJoePoolTokenFetcher extends UniswapV2PoolSubgraphTemplateTokenFetcher {
  appId = TRADER_JOE_DEFINITION.id;
  groupId = TRADER_JOE_DEFINITION.groups.pool.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Pools';

  factoryAddress = '0x9ad6c38be94206ca50bb0d90783181662f0cfa10';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange';
  requiredPools = ['0x23ddca8de11eccd8000263f008a92e10dc1f21e8', '0x2a8a315e82f85d1f0658c5d66a452bbdd9356783'];
}
