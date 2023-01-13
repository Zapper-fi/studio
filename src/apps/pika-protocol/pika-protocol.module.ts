import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolContractFactory } from './contracts';
import { OptimismPikaProtocolVaultContractPositionFetcher } from './optimism/pika-protocol.vault.contract-position-fetcher';
import { PikaProtocolAppDefinition } from './pika-protocol.definition';

@Module({
  providers: [PikaProtocolContractFactory, OptimismPikaProtocolVaultContractPositionFetcher],
})
export class PikaProtocolAppModule extends AbstractApp() {}
