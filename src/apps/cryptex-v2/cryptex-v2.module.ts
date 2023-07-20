import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCryptexV2PostionTokenFetcher } from './arbitrum/cryptex-v2.token.token-fetcher';
import { CryptexV2ContractFactory } from './contracts';

@Module({
  providers: [ArbitrumCryptexV2TokenTokenFetcher, CryptexV2ContractFactory],
})
export class CryptexV2AppModule extends AbstractApp() {}
