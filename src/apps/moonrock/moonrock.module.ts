import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MoonrockContractFactory } from './contracts';
import { EthereumMoonrockIndexTokenFetcher } from './ethereum/moonrock.index.token-fetcher';

@Module({
  providers: [MoonrockContractFactory, EthereumMoonrockIndexTokenFetcher],
})
export class MoonrockAppModule extends AbstractApp() {}
