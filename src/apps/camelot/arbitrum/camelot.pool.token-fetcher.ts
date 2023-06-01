import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.subgraph.template.token-fetcher';

@PositionTemplate()
export class ArbitrumCamelotPoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm';
  factoryAddress = '0x6eccab422d763ac031210895c81787e87b43a652';
}
