import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.auto-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeSwapBoostedFarmV2ContractPositionFetcher } from './binance-smart-chain/pancakeswap.boosted-farm-v2.contract-position-fetcher';
import { BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher } from './binance-smart-chain/pancakeswap.farm-v2.contract-position-fetcher';
import { BinanceSmartChainPancakeswapFarmContractPositionFetcher } from './binance-smart-chain/pancakeswap.farm.contract-position-fetcher';
import { BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.ifo-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './binance-smart-chain/pancakeswap.pool.cache-manager';
import { BinanceSmartChainPancakeSwapPoolTokenFetcher } from './binance-smart-chain/pancakeswap.pool.token-fetcher';
import { BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.syrup-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher } from './binance-smart-chain/pancakeswap.syrup-staking.contract-position-fetcher';
import { PancakeswapContractFactory } from './contracts';
import { PancakeswapAppDefinition } from './pancakeswap.definition';

@Module({
  providers: [
    PancakeswapAppDefinition,
    PancakeswapContractFactory,
    UniswapV2ContractFactory,
    BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher,
    BinanceSmartChainPancakeSwapBoostedFarmV2ContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher,
    BinanceSmartChainPancakeSwapPoolTokenFetcher,
    BinanceSmartChainPancakeswapPoolAddressCacheManager,
  ],
})
export class PancakeSwapAppModule extends AbstractApp() {}
