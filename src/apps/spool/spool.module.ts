import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { EthereumSpoolStakingContractPositionFetcher } from '~apps/spool/ethereum/spool.staking.contract-position-fetcher';

import { SpoolViemContractFactory } from './contracts';
import { EthereumSpoolVaultContractPositionFetcher } from './ethereum/spool.vault.contract-position-fetcher';
import { EthereumSpoolVoSpoolTokenFetcher } from './ethereum/spool.vo-spool.token-fetcher';

@Module({
  providers: [
    EthereumSpoolVoSpoolTokenFetcher,
    EthereumSpoolVaultContractPositionFetcher,
    EthereumSpoolStakingContractPositionFetcher,

    SpoolViemContractFactory,
  ],
})
export class SpoolAppModule extends AbstractApp() {}
