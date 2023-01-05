import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GammaStrategiesContractFactory } from './contracts';
import { EthereumGammaStrategiesPoolTokenFetcher } from './ethereum/gamma-strategies.pool.token-fetcher';
import { EthereumGammaStrategiesTGammaTokenFetcher } from './ethereum/gamma-strategies.t-gamma.token-fetcher';
import { EthereumGammaStrategiesXGammaTokenFetcher } from './ethereum/gamma-strategies.x-gamma.token-fetcher';
import { GammaStrategiesAppDefinition } from './gamma-strategies.definition';

@Module({
  providers: [
    GammaStrategiesAppDefinition,
    GammaStrategiesContractFactory,
    EthereumGammaStrategiesPoolTokenFetcher,
    EthereumGammaStrategiesXGammaTokenFetcher,
    EthereumGammaStrategiesTGammaTokenFetcher,
  ],
})
export class GammaStrategiesAppModule extends AbstractApp() {}
