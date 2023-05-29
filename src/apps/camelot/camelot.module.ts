import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumCamelotDividendContractPositionFetcher } from './arbitrum/camelot.dividend.contract-position-fetcher';
import { ArbitrumCamelotFarmContractPositionFetcher } from './arbitrum/camelot.farm.contract-position-fetcher';
import { ArbitrumCamelotPoolTokenFetcher } from './arbitrum/camelot.pool.token-fetcher';
import { ArbitrumXGrailTokenFetcher } from './arbitrum/camelot.x-grail.token-fetcher';
import { CamelotContractFactory } from './contracts';

@Module({
  providers: [
    CamelotContractFactory,
    UniswapV2ContractFactory,
    // Arbitrum
    ArbitrumCamelotPoolTokenFetcher,
    ArbitrumXGrailTokenFetcher,
    ArbitrumCamelotDividendContractPositionFetcher,
    ArbitrumCamelotFarmContractPositionFetcher,
  ],
})
export class CamelotAppModule extends AbstractApp() {}
