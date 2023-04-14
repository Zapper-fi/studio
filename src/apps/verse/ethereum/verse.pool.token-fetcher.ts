import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.subgraph.template.token-fetcher';

@PositionTemplate()
export class EthereumVersePoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  factoryAddress = '0xee3e9e46e34a27dc755a63e2849c9913ee1a06e2';
  subgraphUrl = 'https://subgraph.api.bitcoin.com/subgraphs/name/verse/exchange';
}
