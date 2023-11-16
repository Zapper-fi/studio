import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumLlamapayStreamContractPositionFetcher } from './arbitrum/llamapay.stream.contract-position-fetcher';
import { ArbitrumLlamapayVestingEscrowContractPositionFetcher } from './arbitrum/llamapay.vesting-escrow.contract-position-fetcher';
import { LlamapayStreamApiClient } from './common/llamapay.stream.api-client';
import { LlamapayViemContractFactory } from './contracts';
import { EthereumLlamapayStreamContractPositionFetcher } from './ethereum/llamapay.stream.contract-position-fetcher';
import { EthereumLlamapayVestingEscrowContractPositionFetcher } from './ethereum/llamapay.vesting-escrow.contract-position-fetcher';
import { OptimismLlamapayStreamContractPositionFetcher } from './optimism/llamapay.stream.contract-position-fetcher';
import { PolygonLlamapayStreamContractPositionFetcher } from './polygon/llamapay.stream.contract-position-fetcher';

@Module({
  providers: [
    LlamapayViemContractFactory,
    LlamapayStreamApiClient,
    ArbitrumLlamapayStreamContractPositionFetcher,
    ArbitrumLlamapayVestingEscrowContractPositionFetcher,
    EthereumLlamapayStreamContractPositionFetcher,
    EthereumLlamapayVestingEscrowContractPositionFetcher,
    OptimismLlamapayStreamContractPositionFetcher,
    PolygonLlamapayStreamContractPositionFetcher,
  ],
})
export class LlamapayAppModule extends AbstractApp() {}
