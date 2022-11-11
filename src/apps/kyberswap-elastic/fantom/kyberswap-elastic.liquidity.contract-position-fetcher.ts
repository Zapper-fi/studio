import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberswapElasticLiquidityContractPositionFetcher } from '../common/kyberswap-elastic.liquidity.contract-position-fetcher';

@PositionTemplate()
export class FantomKyberswapElasticLiquidityContractPositionFetcher extends KyberswapElasticLiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-elastic-fantom';
  positionManagerAddress = '0x2b1c7b41f6a8f2b2bc45c3233a5d5fb3cd6dc9a8';
  factoryAddress = '0x5f1dddbf348ac2fbe22a163e30f99f9ece3dd50a';
  blockSubgraphUrl = 'https://api.thegraph.com/subgraphs/name/kybernetwork/fantom-blocks';
}
