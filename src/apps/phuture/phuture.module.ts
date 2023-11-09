import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePhutureIndexTokenFetcher } from './avalanche/phuture.index.token-fetcher';
import { PhutureViemContractFactory } from './contracts';
import { EthereumPhutureIndexTokenFetcher } from './ethereum/phuture.index.token-fetcher';

@Module({
  providers: [
    PhutureViemContractFactory,
    // Avalanche
    AvalanchePhutureIndexTokenFetcher,
    // Ethereum
    EthereumPhutureIndexTokenFetcher,
  ],
})
export class PhutureAppModule extends AbstractApp() {}
