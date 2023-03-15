import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV3LiquidityContractPositionFetcher } from '../common/uniswap-v3.liquidity.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainUniswapV3LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc';
  positionManagerAddress = '0x7b8a01b39d58278b5de7e48c8449c9f4f5170613';
  factoryAddress = '0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7';
}
