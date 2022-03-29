import { Module } from '@nestjs/common';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';

import { UnagiiContractFactory } from './contracts';
import { EthereumUnagiiBalanceFetcher } from './ethereum/unagii.balance-fetcher';
import { EthereumUnagiiPoolTokenFetcher } from './ethereum/unagii.pool.token-fetcher';
import { UnagiiAppDefinition } from './unagii.definition';

@Module({
  imports: [AppToolkitModule],
  providers: [UnagiiAppDefinition, UnagiiContractFactory, EthereumUnagiiPoolTokenFetcher, EthereumUnagiiBalanceFetcher],
})
export class UnagiiAppModule {}
