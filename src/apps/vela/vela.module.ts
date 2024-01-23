import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumVelaVlpFarmContractPositionFetcher } from './arbitrum/vela.token-farm.contract-position-fetcher';
import { VelaViemContractFactory } from './contracts';

@Module({
  providers: [ArbitrumVelaVlpFarmContractPositionFetcher, VelaViemContractFactory],
})
export class VelaAppModule extends AbstractApp() {}
