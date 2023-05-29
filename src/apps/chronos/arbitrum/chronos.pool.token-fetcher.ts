import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';

@PositionTemplate()
export class ArbitrumChronosPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0xce9240869391928253ed9cc9bcb8cb98cb5b0722';
}
