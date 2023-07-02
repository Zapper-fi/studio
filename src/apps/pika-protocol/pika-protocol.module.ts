import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolContractFactory } from './contracts';
import { OptimismPikaProtocolEsPikaTokenFetcher } from './optimism/pika-protocol.es-pika.token-fetcher';
import { OptimismPikaProtocolEscrowContractPositionFetcher } from './optimism/pika-protocol.escrowed.contract-position-fetcher';
import { OptimismPikaProtocolVaultContractPositionFetcher } from './optimism/pika-protocol.vault.contract-position-fetcher';

@Module({
  providers: [
    PikaProtocolContractFactory,
    OptimismPikaProtocolVaultContractPositionFetcher,
    OptimismPikaProtocolEsPikaTokenFetcher,
    OptimismPikaProtocolEscrowContractPositionFetcher,
  ],
})
export class PikaProtocolAppModule extends AbstractApp() {}
