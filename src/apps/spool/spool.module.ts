import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { EthereumSpoolStakingContractPositionFetcher } from '~apps/spool/ethereum/spool.staking.contract-position-fetcher';

import { SpoolContractFactory } from './contracts';
import { EthereumSpoolBalanceFetcher } from './ethereum/spool.balance-fetcher';
import { EthereumSpoolVaultContractPositionFetcher } from './ethereum/spool.vault.contract-position-fetcher';
import { SpoolAppDefinition } from './spool.definition';

@Module({
  providers: [
    EthereumSpoolBalanceFetcher,
    EthereumSpoolVaultContractPositionFetcher,
    EthereumSpoolStakingContractPositionFetcher,
    SpoolAppDefinition,
    SpoolContractFactory,
  ],
})
export class SpoolAppModule extends AbstractApp() {}
