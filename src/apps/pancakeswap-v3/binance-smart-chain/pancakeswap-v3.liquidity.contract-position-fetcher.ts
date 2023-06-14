import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BinanceSmartChainPancakeswapV3LiquidityContractPositionFetcher } from '../common/pancakeswap-v3.liquidity.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainPancakeSwapV3LiquidityContractPositionFetcher extends BinanceSmartChainPancakeswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc';
  positionManagerAddress = '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364';
  factoryAddress = '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865';
}
