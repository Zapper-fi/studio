import { Register } from '~app-toolkit/decorators';
import { UniswapV2PoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.subgraph.template.token-fetcher';
import { Network } from '~types/network.interface';

import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

const appId = TRADER_JOE_DEFINITION.id;
const groupId = TRADER_JOE_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheTraderJoePoolTokenFetcher extends UniswapV2PoolSubgraphTemplateTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Pools';
  factoryAddress = '0x9ad6c38be94206ca50bb0d90783181662f0cfa10';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange';
  requiredPools = ['0x23ddca8de11eccd8000263f008a92e10dc1f21e8', '0x2a8a315e82f85d1f0658c5d66a452bbdd9356783'];
  skipVolume = true;
}
