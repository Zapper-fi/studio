import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher } from './binance/pancakeswap.auto-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeSwapBalanceFetcher } from './binance/pancakeswap.balance-fetcher';
import { BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher } from './binance/pancakeswap.farm-v2.cotract-position-fetcher';
import { BinanceSmartChainPancakeswapFarmContractPositionFetcher } from './binance/pancakeswap.farm.contract-position-fetcher';
import { BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher } from './binance/pancakeswap.ifo-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './binance/pancakeswap.pool.cache-manager';
import { BinanceSmartChainPancakeSwapPoolTokenFetcher } from './binance/pancakeswap.pool.token-fetcher';
import { BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher } from './binance/pancakeswap.syrup-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher } from './binance/pancakeswap.syrup-staking.contract-position-fetcher';
import { PancakeswapContractFactory } from './contracts';
import { PancakeswapAppDefinition, PANCAKESWAP_DEFINITION } from './pancakeswap.definition';

@Register.AppModule({
  appId: PANCAKESWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    PancakeswapAppDefinition,
    PancakeswapContractFactory,
    BinanceSmartChainPancakeSwapBalanceFetcher,
    BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher,
    BinanceSmartChainPancakeSwapPoolTokenFetcher,
    BinanceSmartChainPancakeswapPoolAddressCacheManager,
  ],
  exports: [PancakeswapContractFactory],
})
export class PancakeSwapAppModule extends AbstractApp() {}
