import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolV3ContractFactory } from './contracts';
import { OptimismPikaProtocolV3VaultContractPositionFetcher } from './optimism/pika-protocol-v3.vault.contract-position-fetcher';
import { PikaProtocolV3AppDefinition } from './pika-protocol-v3.definition';

@Module({
  providers: [PikaProtocolV3ContractFactory, OptimismPikaProtocolV3VaultContractPositionFetcher],
})
export class PikaProtocolV3AppModule extends AbstractApp() {}
