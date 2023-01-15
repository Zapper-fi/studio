import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GainsNetworkContractFactory } from './contracts';
import { PolygonGainsNetworkStakingContractPositionFetcher } from './polygon/gains-network.staking.contract-position-fetcher';

@Module({
  providers: [GainsNetworkContractFactory, PolygonGainsNetworkStakingContractPositionFetcher],
})
export class GainsNetworkAppModule extends AbstractApp() {}
