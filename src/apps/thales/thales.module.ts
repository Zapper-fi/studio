import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { OptimismThalesEscrowContractPositionFetcher } from './optimism/thales.escrow.contract-position-fetcher';
import { OptimismThalesPool2ContractPositionFetcher } from './optimism/thales.pool2.contract-position-fetcher';
import { OptimismThalesStakingContractPositionFetcher } from './optimism/thales.staking.contract-position-fetcher';
import { OptimismThalesVaultContractPositionFetcher } from './optimism/thales.vault.contract-position-fetcher';

@Module({
  providers: [
    ThalesContractFactory,
    OptimismThalesStakingContractPositionFetcher,
    OptimismThalesEscrowContractPositionFetcher,
    OptimismThalesPool2ContractPositionFetcher,
    OptimismThalesVaultContractPositionFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() { }
