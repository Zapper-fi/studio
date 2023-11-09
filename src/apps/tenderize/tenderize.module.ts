import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumTenderizeFarmTokenFetcher } from './arbitrum/tenderize.farm.contract-position-fetcher';
import { ArbitrumTenderizeSwapTokenFetcher } from './arbitrum/tenderize.swap.token-fetcher';
import { ArbitrumTenderizeTenderTokenFetcher } from './arbitrum/tenderize.tender.token-fetcher';
import { TenderizeTokenDefinitionsResolver } from './common/tenderize.token-definition-resolver';
import { TenderizeViemContractFactory } from './contracts';
import { EthereumTenderizeFarmTokenFetcher } from './ethereum/tenderize.farm.contract-position-fetcher';
import { EthereumTenderizeSwapTokenFetcher } from './ethereum/tenderize.swap.token-fetcher';
import { EthereumTenderizeTenderTokenFetcher } from './ethereum/tenderize.tender.token-fetcher';

@Module({
  providers: [
    TenderizeViemContractFactory,
    TenderizeTokenDefinitionsResolver,
    // Arbitrum
    ArbitrumTenderizeSwapTokenFetcher,
    ArbitrumTenderizeTenderTokenFetcher,
    ArbitrumTenderizeFarmTokenFetcher,
    // Ethereum
    EthereumTenderizeTenderTokenFetcher,
    EthereumTenderizeSwapTokenFetcher,
    EthereumTenderizeFarmTokenFetcher,
  ],
})
export class TenderizeAppModule extends AbstractApp() {}
