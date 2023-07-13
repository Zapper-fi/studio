import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.auto-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeSwapBoostedFarmV2ContractPositionFetcher } from './binance-smart-chain/pancakeswap.boosted-farm-v2.contract-position-fetcher';
import { BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher } from './binance-smart-chain/pancakeswap.farm-v2.contract-position-fetcher';
import { BinanceSmartChainPancakeswapFarmContractPositionFetcher } from './binance-smart-chain/pancakeswap.farm.contract-position-fetcher';
import { BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.ifo-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './binance-smart-chain/pancakeswap.pool.cache-manager';
import { BinanceSmartChainPancakeSwapPoolTokenFetcher } from './binance-smart-chain/pancakeswap.pool.token-fetcher';
import { BinanceSmartChainPancakeswapStablePoolTokenFetcher } from './binance-smart-chain/pancakeswap.stable-pool.token-fetcher';
import { BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.syrup-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapSyrupStakingInitContractPositionFetcher } from './binance-smart-chain/pancakeswap.syrup-staking-init.contract-position-fetcher';
import { BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher } from './binance-smart-chain/pancakeswap.syrup-staking.contract-position-fetcher';
import { PancakeswapContractFactory } from './contracts';

@Module({
  providers: [
    PancakeswapContractFactory,
    UniswapV2ContractFactory,
    BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher,
    BinanceSmartChainPancakeSwapBoostedFarmV2ContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupStakingInitContractPositionFetcher,
    BinanceSmartChainPancakeSwapPoolTokenFetcher,
    BinanceSmartChainPancakeswapPoolAddressCacheManager,
    BinanceSmartChainPancakeswapStablePoolTokenFetcher,
  ],
})
export class PancakeSwapAppModule extends AbstractApp() {}
