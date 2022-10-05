import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainBiswapPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x858e3312ed3a876947ea49d572a7c42de08af7ee';
}
