import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './pancakeswap.pool.cache-manager';

@PositionTemplate()
export class BinanceSmartChainPancakeSwapPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

  constructor(
    @Inject(APP_TOOLKIT)
    protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ViemContractFactory) protected readonly contractFactory: UniswapV2ViemContractFactory,
    @Inject(BinanceSmartChainPancakeswapPoolAddressCacheManager)
    protected readonly pancakeswapPoolAddressCacheManager: BinanceSmartChainPancakeswapPoolAddressCacheManager,
  ) {
    super(appToolkit, contractFactory);
  }

  // Override
  getAddresses() {
    return this.pancakeswapPoolAddressCacheManager.getPoolAddresses();
  }
}
