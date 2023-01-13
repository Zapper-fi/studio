import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ManifoldFinanceContractFactory } from './contracts';
import { EthereumManifoldFinanceStakingTokenFetcher } from './ethereum/manifold-finance.staking.token-fetcher';
import { ManifoldFinanceAppDefinition } from './manifold-finance.definition';

@Module({
  providers: [EthereumManifoldFinanceStakingTokenFetcher, ManifoldFinanceContractFactory],
})
export class ManifoldFinanceAppModule extends AbstractApp() {}
