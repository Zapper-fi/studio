import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumCamelotDividendContractPositionFetcher } from './arbitrum/camelot.dividend.contract-position-fetcher';
import { ArbitrumCamelotFarmContractPositionFetcher } from './arbitrum/camelot.farm.contract-position-fetcher';
import { ArbitrumCamelotNitroContractPositionFetcher } from './arbitrum/camelot.nitro.contract-position-fetcher';
import { ArbitrumCamelotPoolV2TokenFetcher } from './arbitrum/camelot.pool-v2.token-fetcher';
import { CamelotViemContractFactory } from './contracts';

@Module({
  providers: [
    CamelotViemContractFactory,
    UniswapV2ViemContractFactory,
    // Arbitrum
    ArbitrumCamelotPoolV2TokenFetcher,
    ArbitrumCamelotDividendContractPositionFetcher,
    ArbitrumCamelotFarmContractPositionFetcher,
    ArbitrumCamelotNitroContractPositionFetcher,
  ],
})
export class CamelotAppModule extends AbstractApp() {}
