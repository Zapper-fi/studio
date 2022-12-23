import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';

@PositionTemplate()
export class AuroraTrisolarisPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  factoryAddress = '0xc66f594268041db60507f00703b152492fb176e7';
  groupLabel = 'Pools';
}
