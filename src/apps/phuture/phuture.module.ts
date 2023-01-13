import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePhutureIndexTokenFetcher } from './avalanche/phuture.index.token-fetcher';
import { PhutureContractFactory } from './contracts';
import { EthereumPhutureIndexTokenFetcher } from './ethereum/phuture.index.token-fetcher';
import { PhutureAppDefinition } from './phuture.definition';

@Module({
  providers: [
    PhutureContractFactory,
    // Avalanche
    AvalanchePhutureIndexTokenFetcher,
    // Ethereum
    EthereumPhutureIndexTokenFetcher,
  ],
})
export class PhutureAppModule extends AbstractApp() {}
