import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';
import { UniswapV2DefaultPoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.default.pool.on-chain.template.token-fetcher';
import { Network } from '~types/network.interface';

import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './pancakeswap.pool.cache-manager';

@PositionTemplate()
export class BinanceSmartChainPancakeSwapPoolTokenFetcher extends UniswapV2DefaultPoolOnChainTemplateTokenFetcher {
  appId = PANCAKESWAP_DEFINITION.id;
  groupId = PANCAKESWAP_DEFINITION.groups.pool.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Pools';
  factoryAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

  constructor(
    @Inject(APP_TOOLKIT)
    protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ContractFactory) protected readonly contractFactory: UniswapV2ContractFactory,
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
