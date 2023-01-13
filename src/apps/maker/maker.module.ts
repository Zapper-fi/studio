import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MakerContractFactory } from './contracts';
import { EthereumMakerGovernanceContractPositionFetcher } from './ethereum/maker.governance.contract-position-fetcher';
import { EthereumMakerVaultContractPositionFetcher } from './ethereum/maker.vault.contract-position-fetcher';
import { MakerAppDefinition } from './maker.definition';

@Module({
  providers: [
    MakerContractFactory,
    EthereumMakerGovernanceContractPositionFetcher,
    EthereumMakerVaultContractPositionFetcher,
  ],
})
export class MakerAppModule extends AbstractApp() {}
