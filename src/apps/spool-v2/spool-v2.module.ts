import { Module } from '@nestjs/common';

import { AbstractApp } from '../../../../studio/src/app/app.dynamic-module';

import { SpoolV2ViemContractFactory } from './contracts';
import { EthereumSpoolV2StakingContractPositionFetcher } from './ethereum/spool-v2.staking.contract-position-fetcher';
import { EthereumSpoolV2VaultContractPositionFetcher } from './ethereum/spool-v2.vault.contract-position-fetcher';
import { EthereumSpoolV2VoSpoolTokenFetcher } from './ethereum/spool-v2.vo-spool.token-fetcher';

@Module({
  providers: [
    EthereumSpoolV2StakingContractPositionFetcher,
    EthereumSpoolV2VaultContractPositionFetcher,
    EthereumSpoolV2VoSpoolTokenFetcher,
    SpoolV2ViemContractFactory,
  ],
})
export class SpoolV2AppModule extends AbstractApp() {}
