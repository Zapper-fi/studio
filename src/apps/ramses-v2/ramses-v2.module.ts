import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ViemContractFactory } from '~apps/uniswap-v3/contracts';

import { ArbitrumRamsesV2LiquidityContractPositionFetcher } from './arbitrum/ramses-v2.liquidity.contract-position-fetcher';

@Module({
  providers: [
    UniswapV3ViemContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    ArbitrumRamsesV2LiquidityContractPositionFetcher,
  ],
})
export class RamsesV2AppModule extends AbstractApp() {}
