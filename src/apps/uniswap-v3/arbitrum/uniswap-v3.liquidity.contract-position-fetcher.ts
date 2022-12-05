import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { UniswapV3LiquidityContractPositionFetcher } from '../common/uniswap-v3.liquidity.contract-position-fetcher';
import { UNISWAP_V3_DEFINITION } from '../uniswap-v3.definition';

@PositionTemplate()
export class ArbitrumUniswapV3LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  appId = UNISWAP_V3_DEFINITION.id;
  groupId = UNISWAP_V3_DEFINITION.groups.liquidity.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev';
  positionManagerAddress = '0xc36442b4a4522e871399cd717abdd847ab11fe88';
  factoryAddress = '0x1f98431c8ad98523631ae4a59f267346ea31f984';
}
