import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LlamapayStreamApiClient } from './common/llamapay.stream.api-client';
import { LlamapayContractFactory } from './contracts';
import { EthereumLlamapayStreamContractPositionFetcher } from './ethereum/llamapay.stream.contract-position-fetcher';
import { EthereumLlamapayVestingEscrowContractPositionFetcher } from './ethereum/llamapay.vesting-escrow.contract-position-fetcher';

@Module({
  providers: [
    LlamapayContractFactory,
    LlamapayStreamApiClient,
    EthereumLlamapayStreamContractPositionFetcher,
    EthereumLlamapayVestingEscrowContractPositionFetcher,
  ],
})
export class LlamapayAppModule extends AbstractApp() {}
