import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumTenderizeSwapTokenFetcher } from './arbitrum/tenderize.swap.token-fetcher';
import { ArbitrumTenderizeTenderTokenFetcher } from './arbitrum/tenderize.tender.token-fetcher';
import { TenderizeTokenDefinitionsResolver } from './common/tenderize.token-definition-resolver';
import { TenderizeContractFactory } from './contracts';
import { EthereumTenderizeSwapTokenFetcher } from './ethereum/tenderize.swap.token-fetcher';
import { EthereumTenderizeTenderTokenFetcher } from './ethereum/tenderize.tender.token-fetcher';

@Module({
  providers: [
    TenderizeContractFactory,
    TenderizeTokenDefinitionsResolver,
    // Arbitrum
    ArbitrumTenderizeSwapTokenFetcher,
    ArbitrumTenderizeTenderTokenFetcher,
    // Ethereum
    EthereumTenderizeTenderTokenFetcher,
    EthereumTenderizeSwapTokenFetcher,
  ],
})
export class TenderizeAppModule extends AbstractApp() {}
