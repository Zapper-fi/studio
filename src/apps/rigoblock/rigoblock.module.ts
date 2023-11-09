import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ViemContractFactory } from '~apps/uniswap-v3/contracts';

import { ArbitrumRigoblockPoolContractPositionFetcher } from './arbitrum/rigoblock.pool.contract-position-fetcher';
import { ArbitrumRigoblockPoolTokenFetcher } from './arbitrum/rigoblock.pool.token-fetcher';
import { RigoblockLogProvider } from './common/rigoblock.log-provider';
import { RigoblockViemContractFactory } from './contracts';
import { EthereumRigoblockPoolContractPositionFetcher } from './ethereum/rigoblock.pool.contract-position-fetcher';
import { EthereumRigoblockPoolTokenFetcher } from './ethereum/rigoblock.pool.token-fetcher';
import { OptimismRigoblockPoolContractPositionFetcher } from './optimism/rigoblock.pool.contract-position-fetcher';
import { OptimismRigoblockPoolTokenFetcher } from './optimism/rigoblock.pool.token-fetcher';
import { PolygonRigoblockPoolContractPositionFetcher } from './polygon/rigoblock.pool.contract-position-fetcher';
import { PolygonRigoblockPoolTokenFetcher } from './polygon/rigoblock.pool.token-fetcher';

@Module({
  providers: [
    UniswapV3ContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    ArbitrumRigoblockPoolContractPositionFetcher,
    ArbitrumRigoblockPoolTokenFetcher,
    EthereumRigoblockPoolContractPositionFetcher,
    EthereumRigoblockPoolTokenFetcher,
    OptimismRigoblockPoolContractPositionFetcher,
    OptimismRigoblockPoolTokenFetcher,
    PolygonRigoblockPoolContractPositionFetcher,
    PolygonRigoblockPoolTokenFetcher,
    RigoblockContractFactory,
    RigoblockLogProvider,
  ],
})
export class RigoblockAppModule extends AbstractApp() {}
