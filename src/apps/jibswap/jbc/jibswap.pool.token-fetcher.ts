import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.subgraph.template.token-fetcher';

@PositionTemplate()
export class JBCJibswapPoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://graph.jibswap.com/subgraphs/name/jibswap?source=zapper';
  factoryAddress = '0x4bbda880c5a0cdcec6510f0450c6c8bc5773d499';
}
