import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolViemContractFactory } from './contracts';
import { OptimismPikaProtocolEscrowContractPositionFetcher } from './optimism/pika-protocol.escrowed.contract-position-fetcher';
import { OptimismPikaProtocolVaultContractPositionFetcher } from './optimism/pika-protocol.vault.contract-position-fetcher';

@Module({
  providers: [
    PikaProtocolViemContractFactory,
    OptimismPikaProtocolVaultContractPositionFetcher,
    OptimismPikaProtocolEscrowContractPositionFetcher,
  ],
})
export class PikaProtocolAppModule extends AbstractApp() {}
