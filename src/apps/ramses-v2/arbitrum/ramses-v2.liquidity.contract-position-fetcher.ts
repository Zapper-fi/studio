import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV3LiquidityContractPositionFetcher } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumRamsesV2LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ramsesexchange/concentrated-liquidity-graph?source=zapper';
  positionManagerAddress = '0xaa277cb7914b7e5514946da92cb9de332ce610ef';
  factoryAddress = '0xaa2cd7477c451e703f3b9ba5663334914763edf8';
}
