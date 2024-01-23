import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '../common/uniswap-v2.default.subgraph.template.token-fetcher';

@PositionTemplate()
export class EthereumUniswapV2PoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  factoryAddress = '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev?source=zapper';
  ignoredPools = ['0x3016a43b482d0480460f6625115bd372fe90c6bf'];
  requiredPools = ['0x1f249f8b5a42aa78cc8a2b66ee0bb015468a5f43'];
  orderBy = 'trackedReserveETH';
  first = 1000;
}
