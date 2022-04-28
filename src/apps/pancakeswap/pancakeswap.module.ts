import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';
import { ExternalAppImport } from '~lib';

import { BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher } from './binance/pancakeswap.auto-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeSwapBalanceFetcher } from './binance/pancakeswap.balance-fetcher';
import { BinanceSmartChainPancakeswapFarmContractPositionFetcher } from './binance/pancakeswap.farm.contract-position-fetcher';
import { BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher } from './binance/pancakeswap.ifo-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './binance/pancakeswap.pool.cache-manager';
import { BinanceSmartChainPancakeSwapPoolTokenFetcher } from './binance/pancakeswap.pool.token-fetcher';
import { BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher } from './binance/pancakeswap.syrup-staking.contract-position-fetcher';
import { BinanceSmartChainPancakeSwapTvlFetcher } from './binance/pancakeswap.tvl-fetcher';
import { PancakeswapContractFactory } from './contracts';
import { PancakeswapAppDefinition } from './pancakeswap.definition';

@Module({
  imports: ExternalAppImport(UniswapV2AppModule),
  providers: [
    PancakeswapAppDefinition,
    PancakeswapContractFactory,
    BinanceSmartChainPancakeSwapBalanceFetcher,
    BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher,
    BinanceSmartChainPancakeSwapPoolTokenFetcher,
    BinanceSmartChainPancakeswapPoolAddressCacheManager,
    BinanceSmartChainPancakeSwapTvlFetcher,
  ],
  exports: [PancakeswapContractFactory],
})
export class PancakeSwapAppModule extends AbstractApp() {}
