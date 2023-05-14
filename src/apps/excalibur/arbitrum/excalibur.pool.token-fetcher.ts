import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';

@PositionTemplate()
export class ArbitrumExcaliburPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0xd158bd9e8b6efd3ca76830b66715aa2b7bad2218';
}
