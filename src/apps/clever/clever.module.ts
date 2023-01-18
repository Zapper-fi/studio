import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CleverContractFactory } from './contracts';
import { EthereumCleverFurnaceContractPositionFetcher } from './ethereum/clever.furnace.contract-position-fetcher';
import { EthereumCleverLeverTokenFetcher } from './ethereum/clever.lever.token-fetcher';
import { EthereumCleverLockContractPositionFetcher } from './ethereum/clever.lock.contract-position-fetcher';

@Module({
  providers: [
    CleverContractFactory,
    EthereumCleverLeverTokenFetcher,
    EthereumCleverFurnaceContractPositionFetcher,
    EthereumCleverLockContractPositionFetcher,
  ],
})
export class CleverAppModule extends AbstractApp() {}
