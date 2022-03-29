import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { UnagiiContractFactory } from './contracts';
import { EthereumUnagiiBalanceFetcher } from './ethereum/unagii.balance-fetcher';
import { EthereumUnagiiPoolTokenFetcher } from './ethereum/unagii.pool.token-fetcher';
import { UnagiiAppDefinition } from './unagii.definition';

@Module({
  providers: [UnagiiAppDefinition, UnagiiContractFactory, EthereumUnagiiPoolTokenFetcher, EthereumUnagiiBalanceFetcher],
})
export class UnagiiAppModule extends AbstractDynamicApp<UnagiiAppModule>() {}
