import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { UniswapV2ContractFactory } from './contracts';
import { EthereumUniswapV2BalanceFetcher } from './ethereum/uniswap-v2.balance-fetcher';
import { EthereumUniswapV2PoolTokenFetcher } from './ethereum/uniswap-v2.pool.token-fetcher';
import { UniswapV2OnChainPoolTokenAddressStrategy } from './helpers/uniswap-v2.on-chain.pool-token-address-strategy';
import { UniswapV2PoolTokenHelper } from './helpers/uniswap-v2.pool.token-helper';
import { UniswapV2TheGraphPoolTokenAddressStrategy } from './helpers/uniswap-v2.the-graph.pool-token-address-strategy';
import { UniswapV2TheGraphPoolTokenBalanceHelper } from './helpers/uniswap-v2.the-graph.pool-token-balance-helper';
import { UniswapV2TheGraphPoolVolumeStrategy } from './helpers/uniswap-v2.the-graph.pool-volume-strategy';
import { UniswapV2AppDefinition } from './uniswap-v2.definition';

@Module({
  providers: [
    UniswapV2AppDefinition,
    UniswapV2ContractFactory,
    EthereumUniswapV2PoolTokenFetcher,
    EthereumUniswapV2BalanceFetcher,
    // Helpers
    UniswapV2PoolTokenHelper,
    UniswapV2OnChainPoolTokenAddressStrategy,
    UniswapV2TheGraphPoolTokenAddressStrategy,
    UniswapV2TheGraphPoolVolumeStrategy,
    UniswapV2TheGraphPoolTokenBalanceHelper,
  ],
  exports: [
    UniswapV2ContractFactory,
    UniswapV2PoolTokenHelper,
    UniswapV2OnChainPoolTokenAddressStrategy,
    UniswapV2TheGraphPoolTokenAddressStrategy,
    UniswapV2TheGraphPoolVolumeStrategy,
    UniswapV2TheGraphPoolTokenBalanceHelper,
  ],
})
export class UniswapV2AppModule extends AbstractDynamicApp<UniswapV2AppModule>() {}
