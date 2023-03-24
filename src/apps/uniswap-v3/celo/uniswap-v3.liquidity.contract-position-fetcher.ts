import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV3LiquidityContractPositionFetcher } from '../common/uniswap-v3.liquidity.contract-position-fetcher';

@PositionTemplate()
export class CeloUniswapV3LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo';
  positionManagerAddress = '0x3d79edaabc0eab6f08ed885c05fc0b014290d95a';
  factoryAddress = '0xafe208a311b21f13ef87e33a90049fc17a7acdec';
}
