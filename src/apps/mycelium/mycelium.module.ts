import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMyceliumEsMycTokenFetcher } from './arbitrum/mycelium.es-myc.token-fetcher';
import { ArbitrumMyceliumMlpTokenFetcher } from './arbitrum/mycelium.mlp.token-fetcher';
import { ArbitrumMycellilumPerpContractPositionFetcher } from './arbitrum/mycelium.perp.contract-position-fetcher';
import { MyceliumViemContractFactory } from './contracts';

@Module({
  providers: [
    MyceliumContractFactory,
    // Arbitrum
    ArbitrumMyceliumEsMycTokenFetcher,
    ArbitrumMyceliumMlpTokenFetcher,
    ArbitrumMycellilumPerpContractPositionFetcher,
  ],
})
export class MyceliumAppModule extends AbstractApp() {}
