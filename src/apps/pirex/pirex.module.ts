import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PirexContractFactory } from './contracts';
import { EthereumPirexVaultTokenFetcher } from './ethereum/pirex.vault.token-fetcher';
import { PirexAppDefinition } from './pirex.definition';

@Module({
  providers: [EthereumPirexVaultTokenFetcher, PirexAppDefinition, PirexContractFactory],
})
export class PirexAppModule extends AbstractApp() {}
