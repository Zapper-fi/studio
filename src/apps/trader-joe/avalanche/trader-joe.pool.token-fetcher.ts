import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.subgraph.template.token-fetcher';

@PositionTemplate()
export class AvalancheTraderJoePoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  factoryAddress = '0x9ad6c38be94206ca50bb0d90783181662f0cfa10';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange?source=zapper';
  requiredPools = ['0x23ddca8de11eccd8000263f008a92e10dc1f21e8', '0x2a8a315e82f85d1f0658c5d66a452bbdd9356783'];
}
