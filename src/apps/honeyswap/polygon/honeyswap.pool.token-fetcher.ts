import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.subgraph.template.token-fetcher';

@PositionTemplate()
export class PolygonHoneyswapPoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-polygon?source=zapper';
  factoryAddress = '0x03daa61d8007443a6584e3d8f85105096543c19c';
}
