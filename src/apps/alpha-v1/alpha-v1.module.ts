import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { AlphaV1AppDefinition } from './alpha-v1.definition';
import { AlphaV1ContractFactory } from './contracts';
import { EthereumAlphaV1BalanceFetcher } from './ethereum/alpha-v1.balance-fetcher';
import { EthereumAlphaV1LendingTokenFetcher } from './ethereum/alpha-v1.lending.token-fetcher';

@Module({
  providers: [
    AlphaV1AppDefinition,
    AlphaV1ContractFactory,
    EthereumAlphaV1BalanceFetcher,
    EthereumAlphaV1LendingTokenFetcher,
  ],
})
export class AlphaV1AppModule extends AbstractDynamicApp<AlphaV1AppModule>() {}
