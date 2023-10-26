import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumCamelotDividendContractPositionFetcher } from './arbitrum/camelot.dividend.contract-position-fetcher';
import { ArbitrumCamelotFarmContractPositionFetcher } from './arbitrum/camelot.farm.contract-position-fetcher';
import { ArbitrumCamelotNitroContractPositionFetcher } from './arbitrum/camelot.nitro.contract-position-fetcher';
import { ArbitrumCamelotPoolV2TokenFetcher } from './arbitrum/camelot.pool-v2.token-fetcher';
import { ArbitrumXGrailTokenFetcher } from './arbitrum/camelot.x-grail.token-fetcher';
import { CamelotContractFactory } from './contracts';

@Module({
  providers: [
    CamelotContractFactory,
    UniswapV2ContractFactory,
    // Arbitrum
    ArbitrumCamelotPoolV2TokenFetcher,
    ArbitrumXGrailTokenFetcher,
    ArbitrumCamelotDividendContractPositionFetcher,
    ArbitrumCamelotFarmContractPositionFetcher,
    ArbitrumCamelotNitroContractPositionFetcher,
  ],
})
export class CamelotAppModule extends AbstractApp() {}
