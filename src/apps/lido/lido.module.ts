import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LidoViemContractFactory } from './contracts';
import { EthereumLidoStethTokenFetcher } from './ethereum/lido.steth.token-fetcher';
import { EthereumLidoWstethTokenFetcher } from './ethereum/lido.wsteth.token-fetcher';

@Module({
  providers: [LidoContractFactory, EthereumLidoStethTokenFetcher, EthereumLidoWstethTokenFetcher],
})
export class LidoAppModule extends AbstractApp() {}
