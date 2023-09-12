import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV3LiquidityContractPositionFetcher } from '../common/uniswap-v3.liquidity.contract-position-fetcher';

@PositionTemplate()
export class EthereumUniswapV3LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=zapper';
  positionManagerAddress = '0xc36442b4a4522e871399cd717abdd847ab11fe88';
  factoryAddress = '0x1f98431c8ad98523631ae4a59f267346ea31f984';
}
