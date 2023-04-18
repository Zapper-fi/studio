import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumVelaVlpTokenFetcher } from './arbitrum/vela.beta-vlp.token-fetcher';
import { ArbitrumVelaEsVelaTokenFetcher } from './arbitrum/vela.es-vela.token-fetcher';
import { ArbitrumVelaVlpFarmContractPositionFetcher } from './arbitrum/vela.token-farm.contract-position-fetcher';
import { VelaContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumVelaEsVelaTokenFetcher,
    ArbitrumVelaVlpFarmContractPositionFetcher,
    ArbitrumVelaVlpTokenFetcher,
    VelaContractFactory,
  ],
})
export class VelaAppModule extends AbstractApp() {}
