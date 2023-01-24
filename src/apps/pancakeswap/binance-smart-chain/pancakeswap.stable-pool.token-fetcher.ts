import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PancakeswapStablePoolTokenFetcher } from '../common/pancakeswap.stable-pool.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainPancakeswapStablePoolTokenFetcher extends PancakeswapStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x36bbb126e75351c0dfb651e39b38fe0bc436ffd2';
}
