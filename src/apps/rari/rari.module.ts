import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RariViemContractFactory } from './contracts';
import { EthereumRariFarmContractPositionFetcher } from './ethereum/rari.farm.contract-position-fetcher';
import { EthereumRariFundTokenFetcher } from './ethereum/rari.fund.token-fetcher';
import { EthereumRariGovernanceContractPositionFetcher } from './ethereum/rari.governance.contract-position-fetcher';

@Module({
  providers: [
    RariViemContractFactory,
    EthereumRariFarmContractPositionFetcher,
    EthereumRariFundTokenFetcher,
    EthereumRariGovernanceContractPositionFetcher,
  ],
})
export class RariAppModule extends AbstractApp() {}
