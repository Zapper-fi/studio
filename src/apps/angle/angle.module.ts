import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AngleAppDefinition } from './angle.definition';
import { AngleApiHelper } from './common/angle.api';
import { AngleContractFactory } from './contracts';
import { EthereumAnglePerpetualsContractPositionFetcher } from './ethereum/angle.perpetual.contract-position-fetcher';
import { EthereumAngleSanTokenTokenFetcher } from './ethereum/angle.san-token.token-fetcher';
import { EthereumAngleVaultsContractPositionFetcher } from './ethereum/angle.vault.contract-position-fetcher';
import { EthereumAngleVeAngleContractPositionFetcher } from './ethereum/angle.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    AngleContractFactory,
    AngleApiHelper,
    // Ethereum
    EthereumAngleSanTokenTokenFetcher,
    EthereumAngleVeAngleContractPositionFetcher,
    EthereumAnglePerpetualsContractPositionFetcher,
    EthereumAngleVaultsContractPositionFetcher,
  ],
})
export class AngleAppModule extends AbstractApp() {}
