import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCryptexV2RebatesContractPositionFetcher } from './arbitrum/cryptex-v2.rebates.contract-position-fetcher';
import { ArbitrumDsuTokenFetcher } from './arbitrum/cryptex-v2.token.dsu-token-fetcher';
import { CryptexV2ContractFactory } from './contracts';

@Module({
  providers: [CryptexV2ContractFactory, ArbitrumDsuTokenFetcher, ArbitrumCryptexV2RebatesContractPositionFetcher],
})
export class Cryptexv2AppModule extends AbstractApp() {}
