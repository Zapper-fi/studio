import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MakerViemContractFactory } from './contracts';
import { EthereumMakerDsrContractPositionFetcher } from './ethereum/maker.dsr.contract-position-fetcher';
import { EthereumMakerGovernanceContractPositionFetcher } from './ethereum/maker.governance.contract-position-fetcher';
import { EthereumMakerVaultContractPositionFetcher } from './ethereum/maker.vault.contract-position-fetcher';

@Module({
  providers: [
    MakerViemContractFactory,
    EthereumMakerGovernanceContractPositionFetcher,
    EthereumMakerVaultContractPositionFetcher,
    EthereumMakerDsrContractPositionFetcher,
  ],
})
export class MakerAppModule extends AbstractApp() {}
