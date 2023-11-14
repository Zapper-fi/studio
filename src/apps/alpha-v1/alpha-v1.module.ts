import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AlphaV1ViemContractFactory } from './contracts';
import { EthereumAlphaV1LendingTokenFetcher } from './ethereum/alpha-v1.lending.token-fetcher';

@Module({
  providers: [AlphaV1ViemContractFactory, EthereumAlphaV1LendingTokenFetcher],
})
export class AlphaV1AppModule extends AbstractApp() {}
