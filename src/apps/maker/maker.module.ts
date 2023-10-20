import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MakerContractFactory } from './contracts';
import { EthereumMakerGovernanceContractPositionFetcher } from './ethereum/maker.governance.contract-position-fetcher';
import { EthereumMakerSDaiTokenFetcher } from './ethereum/maker.s-dai.token-fetcher';
import { EthereumMakerVaultContractPositionFetcher } from './ethereum/maker.vault.contract-position-fetcher';

@Module({
  providers: [
    MakerContractFactory,
    EthereumMakerGovernanceContractPositionFetcher,
    EthereumMakerVaultContractPositionFetcher,
    EthereumMakerSDaiTokenFetcher,
  ],
})
export class MakerAppModule extends AbstractApp() {}
