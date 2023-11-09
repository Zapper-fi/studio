import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolV3ViemContractFactory } from './contracts';
import { OptimismPikaProtocolV3VaultContractPositionFetcher } from './optimism/pika-protocol-v3.vault.contract-position-fetcher';

@Module({
  providers: [PikaProtocolV3ViemContractFactory, OptimismPikaProtocolV3VaultContractPositionFetcher],
})
export class PikaProtocolV3AppModule extends AbstractApp() {}
