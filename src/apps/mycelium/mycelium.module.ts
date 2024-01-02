import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMyceliumMlpTokenFetcher } from './arbitrum/mycelium.mlp.token-fetcher';
import { ArbitrumMycellilumPerpContractPositionFetcher } from './arbitrum/mycelium.perp.contract-position-fetcher';
import { MyceliumViemContractFactory } from './contracts';

@Module({
  providers: [
    MyceliumViemContractFactory,
    // Arbitrum
    ArbitrumMyceliumMlpTokenFetcher,
    ArbitrumMycellilumPerpContractPositionFetcher,
  ],
})
export class MyceliumAppModule extends AbstractApp() {}
