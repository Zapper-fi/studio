import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AngleApiHelper } from './common/angle.api';
import { AngleViemContractFactory } from './contracts';
import { EthereumAngleSanTokenTokenFetcher } from './ethereum/angle.san-token.token-fetcher';
import { EthereumAngleVaultsContractPositionFetcher } from './ethereum/angle.vault.contract-position-fetcher';
import { EthereumAngleVeAngleContractPositionFetcher } from './ethereum/angle.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    AngleViemContractFactory,
    AngleApiHelper,
    // Ethereum
    EthereumAngleSanTokenTokenFetcher,
    EthereumAngleVeAngleContractPositionFetcher,
    EthereumAngleVaultsContractPositionFetcher,
  ],
})
export class AngleAppModule extends AbstractApp() {}
