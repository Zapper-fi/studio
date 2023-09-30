import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGravitaStabilityPoolContractPositionFetcher } from './arbitrum/gravita.stability-pool.contract-position-fetcher';
import { ArbitrumGravitaVesselContractPositionFetcher } from './arbitrum/gravita.vessel.contract-position-fetcher';
import { GravitaContractFactory } from './contracts';
import { EthereumGravitaStabilityPoolContractPositionFetcher } from './ethereum/gravita.stability-pool.contract-position-fetcher';
import { EthereumGravitaVesselContractPositionFetcher } from './ethereum/gravita.vessel.contract-position-fetcher';

@Module({
  providers: [
    ArbitrumGravitaStabilityPoolContractPositionFetcher,
    ArbitrumGravitaVesselContractPositionFetcher,
    EthereumGravitaStabilityPoolContractPositionFetcher,
    EthereumGravitaVesselContractPositionFetcher,
    GravitaContractFactory,
  ],
})
export class GravitaAppModule extends AbstractApp() { }
