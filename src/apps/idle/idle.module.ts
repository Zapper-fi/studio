import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { IdleTranchesDefinitionsResolver } from './common/idle.tranche.token-definitions-resolver';
import { IdleContractFactory } from './contracts';
import { EthereumIdleBestYieldContractPositionFetcher } from './ethereum/idle.best-yield.contract-position-fetcher';
import { EthereumIdleJuniorTranchesPoolTokenFetcher } from './ethereum/idle.junior-tranche.token-fetcher';
import { EthereumIdleSeniorTranchesPoolTokenFetcher } from './ethereum/idle.senior-tranche.token-fetcher';
import { EthereumIdleVaultTokenFetcher } from './ethereum/idle.vault.token-fetcher';

@Module({
  providers: [
    IdleContractFactory,
    IdleTranchesDefinitionsResolver,
    EthereumIdleBestYieldContractPositionFetcher,
    EthereumIdleVaultTokenFetcher,
    EthereumIdleJuniorTranchesPoolTokenFetcher,
    EthereumIdleSeniorTranchesPoolTokenFetcher,
  ],
})
export class IdleAppModule extends AbstractApp() {}
