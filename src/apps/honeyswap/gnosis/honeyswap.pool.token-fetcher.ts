import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.subgraph.template.token-fetcher';

@PositionTemplate()
export class GnosisHoneyswapPoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-xdai';
  factoryAddress = '0x9ad6c38be94206ca50bb0d90783181662f0cfa10';
}
