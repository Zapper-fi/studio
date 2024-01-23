import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumAngleVaultsContractPositionFetcher } from './arbitrum/angle.vault.contract-position-fetcher';
import { AnglePositionResolver } from './common/angle.position-resolver';
import { AngleViemContractFactory } from './contracts';
import { EthereumAngleVaultsContractPositionFetcher } from './ethereum/angle.vault.contract-position-fetcher';
import { EthereumAngleVeAngleContractPositionFetcher } from './ethereum/angle.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    AngleViemContractFactory,
    AnglePositionResolver,
    // Arbitrum
    ArbitrumAngleVaultsContractPositionFetcher,
    // Ethereum
    EthereumAngleVeAngleContractPositionFetcher,
    EthereumAngleVaultsContractPositionFetcher,
  ],
})
export class AngleAppModule extends AbstractApp() {}
