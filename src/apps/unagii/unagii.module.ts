import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UnagiiContractFactory } from './contracts';
import { EthereumUnagiiBalanceFetcher } from './ethereum/unagii.balance-fetcher';
import { EthereumUnagiiPoolTokenFetcher } from './ethereum/unagii.pool.token-fetcher';
import { UnagiiAppDefinition } from './unagii.definition';

@Module({
  providers: [UnagiiAppDefinition, UnagiiContractFactory, EthereumUnagiiPoolTokenFetcher, EthereumUnagiiBalanceFetcher],
})
export class UnagiiAppModule extends AbstractApp() {}
