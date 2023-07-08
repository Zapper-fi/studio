import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3ContractFactory } from '~apps/uniswap-v3/contracts';

import { ArbitrumRamsesV2LiquidityContractPositionFetcher } from './arbitrum/ramses-v2.liquidity.contract-position-fetcher';
import { UniswapV3LiquidityContractPositionBuilder } from './common/uniswap-v3.liquidity.contract-position-builder';

@Module({
  providers: [
    UniswapV3ContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    ArbitrumRamsesV2LiquidityContractPositionFetcher,
  ],
})
export class RamsesV2AppModule extends AbstractApp() {}
