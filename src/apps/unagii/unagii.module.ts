import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UnagiiContractFactory } from './contracts';
import { EthereumUnagiiVaultTokenFetcher } from './ethereum/unagii.vault.token-fetcher';
import { UnagiiAppDefinition } from './unagii.definition';

@Module({
  providers: [UnagiiAppDefinition, UnagiiContractFactory, EthereumUnagiiVaultTokenFetcher],
})
export class UnagiiAppModule extends AbstractApp() {}
