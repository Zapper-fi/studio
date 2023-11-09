import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ManifoldFinanceViemContractFactory } from './contracts';
import { EthereumManifoldFinanceStakingTokenFetcher } from './ethereum/manifold-finance.staking.token-fetcher';

@Module({
  providers: [EthereumManifoldFinanceStakingTokenFetcher, ManifoldFinanceContractFactory],
})
export class ManifoldFinanceAppModule extends AbstractApp() {}
