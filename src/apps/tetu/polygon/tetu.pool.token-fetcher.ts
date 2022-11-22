import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';

@PositionTemplate()
export class PolygonTetuPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x684d8c187be836171a1af8d533e4724893031828';
}
