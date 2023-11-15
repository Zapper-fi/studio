import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MoonrockViemContractFactory } from './contracts';
import { EthereumMoonrockIndexTokenFetcher } from './ethereum/moonrock.index.token-fetcher';

@Module({
  providers: [MoonrockViemContractFactory, EthereumMoonrockIndexTokenFetcher],
})
export class MoonrockAppModule extends AbstractApp() {}
