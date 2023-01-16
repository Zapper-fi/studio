import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GainsNetworkContractFactory } from './contracts';
import { PolygonGainsNetworkGTokenTokenFetcher } from './polygon/gains-network.g-token.token-fetcher';
import { PolygonGainsNetworkLockedContractPositionFetcher } from './polygon/gains-network.locked.contract-position-fetcher';
import { PolygonGainsNetworkStakingContractPositionFetcher } from './polygon/gains-network.staking.contract-position-fetcher';

@Module({
  providers: [
    GainsNetworkContractFactory,
    PolygonGainsNetworkStakingContractPositionFetcher,
    PolygonGainsNetworkGTokenTokenFetcher,
    PolygonGainsNetworkLockedContractPositionFetcher,
  ],
})
export class GainsNetworkAppModule extends AbstractApp() {}
