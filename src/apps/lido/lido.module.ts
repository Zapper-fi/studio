import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LidoContractFactory } from './contracts';
import { EthereumLidoStethTokenFetcher } from './ethereum/lido.steth.token-fetcher';
import { EthereumLidoTvlFetcher } from './ethereum/lido.tvl-fetcher';
import { EthereumLidoWstethTokenFetcher } from './ethereum/lido.wsteth.token-fetcher';
import { LidoAppDefinition } from './lido.definition';

@Module({
  providers: [
    LidoAppDefinition,
    LidoContractFactory,
    EthereumLidoTvlFetcher,
    EthereumLidoStethTokenFetcher,
    EthereumLidoWstethTokenFetcher,
  ],
})
export class LidoAppModule extends AbstractApp() {}
