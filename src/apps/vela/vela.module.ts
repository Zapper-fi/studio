import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumVelaVlpFarmContractPositionFetcher } from './arbitrum/vela.token-farm.contract-position-fetcher';
import { ArbitrumVelaVlpTokenFetcher } from './arbitrum/vela.vlp.token-fetcher';
import { VelaViemContractFactory } from './contracts';

@Module({
  providers: [ArbitrumVelaVlpFarmContractPositionFetcher, ArbitrumVelaVlpTokenFetcher, VelaViemContractFactory],
})
export class VelaAppModule extends AbstractApp() {}
