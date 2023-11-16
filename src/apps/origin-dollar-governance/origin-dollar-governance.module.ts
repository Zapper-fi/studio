import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OriginDollarGovernanceViemContractFactory } from './contracts';
import { EthereumOriginDollarGovernanceVeOgvContractPositionFetcher } from './ethereum/origin-dollar-governance.ve-ogv.contract-position-fetcher';
import { EthereumOriginDollarGovernanceWousdTokenFetcher } from './ethereum/origin-dollar-governance.wousd.token-fetcher';

@Module({
  providers: [
    OriginDollarGovernanceViemContractFactory,
    // Ethereum
    EthereumOriginDollarGovernanceVeOgvContractPositionFetcher,
    EthereumOriginDollarGovernanceWousdTokenFetcher,
  ],
})
export class OriginDollarGovernanceAppModule extends AbstractApp() {}
