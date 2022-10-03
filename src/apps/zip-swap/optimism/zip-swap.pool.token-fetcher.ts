import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

@PositionTemplate()
export class OptimismZipSwapPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x8bcedd62dd46f1a76f8a1633d4f5b76e0cda521e';
}
