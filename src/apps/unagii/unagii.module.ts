import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UnagiiViemContractFactory } from './contracts';
import { EthereumUnagiiVaultTokenFetcher } from './ethereum/unagii.vault.token-fetcher';

@Module({
  providers: [UnagiiViemContractFactory, EthereumUnagiiVaultTokenFetcher],
})
export class UnagiiAppModule extends AbstractApp() {}
