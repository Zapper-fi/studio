import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GroViemContractFactory } from './contracts';
import { EthereumGroFarmContractPositionFetcher } from './ethereum/gro.farm.contract-position-fetcher';
import { EthereumGroVestingContractPositionFetcher } from './ethereum/gro.vesting.contract-position-fetcher';

@Module({
  providers: [
    GroViemContractFactory,
    // Ethereum
    EthereumGroFarmContractPositionFetcher,
    EthereumGroVestingContractPositionFetcher,
  ],
})
export class GroAppModule extends AbstractApp() {}
