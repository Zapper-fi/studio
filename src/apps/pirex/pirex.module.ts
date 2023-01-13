import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PirexContractFactory } from './contracts';
import { EthereumPirexVaultTokenFetcher } from './ethereum/pirex.vault.token-fetcher';

@Module({
  providers: [EthereumPirexVaultTokenFetcher, PirexContractFactory],
})
export class PirexAppModule extends AbstractApp() {}
