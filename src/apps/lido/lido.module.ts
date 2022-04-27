import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { LidoContractFactory } from './contracts';
import { EthereumLidoBalanceFetcher } from './ethereum/lido.balance-fetcher';
import { EthereumLidoStethTokenFetcher } from './ethereum/lido.steth.token-fetcher';
import { EthereumLidoWstethTokenFetcher } from './ethereum/lido.wsteth.token-fetcher';
import { EthereumLidoTvlFetcher } from './ethereum/lido.tvl-fetcher';
import { LidoAppDefinition } from './lido.definition';

@Module({
  providers: [
    LidoAppDefinition,
    LidoContractFactory,
    EthereumLidoTvlFetcher,
    EthereumLidoBalanceFetcher,
    EthereumLidoStethTokenFetcher,
    EthereumLidoWstethTokenFetcher,
  ],
})
export class LidoAppModule extends AbstractDynamicApp<LidoAppModule>() {}
