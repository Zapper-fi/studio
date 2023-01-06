import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { EthereumSpoolStakingContractPositionFetcher } from '~apps/spool/ethereum/spool.staking.contract-position-fetcher';

import { SpoolContractFactory } from './contracts';
import { EthereumSpoolVaultContractPositionFetcher } from './ethereum/spool.vault.contract-position-fetcher';
import { EthereumSpoolVoSpoolTokenFetcher } from './ethereum/spool.vo-spool.token-fetcher';
import { SpoolAppDefinition } from './spool.definition';

@Module({
  providers: [
    EthereumSpoolVoSpoolTokenFetcher,
    EthereumSpoolVaultContractPositionFetcher,
    EthereumSpoolStakingContractPositionFetcher,
    SpoolAppDefinition,
    SpoolContractFactory,
  ],
})
export class SpoolAppModule extends AbstractApp() {}
