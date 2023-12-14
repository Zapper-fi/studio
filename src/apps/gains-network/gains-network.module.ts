import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGainsNetworkGTokenTokenFetcher } from './arbitrum/gains-network.g-token.token-fetcher';
import { ArbitrumGainsNetworkLockedContractPositionFetcher } from './arbitrum/gains-network.locked.contract-position-fetcher';
import { ArbitrumGainsNetworkStakingV2ContractPositionFetcher } from './arbitrum/gains-network.staking-v2.contract-position-fetcher';
import { ArbitrumGainsNetworkStakingContractPositionFetcher } from './arbitrum/gains-network.staking.contract-position-fetcher';
import { GainsNetworkViemContractFactory } from './contracts';
import { PolygonGainsNetworkGTokenTokenFetcher } from './polygon/gains-network.g-token.token-fetcher';
import { PolygonGainsNetworkLockedContractPositionFetcher } from './polygon/gains-network.locked.contract-position-fetcher';
import { PolygonGainsNetworkStakingV2ContractPositionFetcher } from './polygon/gains-network.staking-v2.contract-position-fetcher';
import { PolygonGainsNetworkStakingContractPositionFetcher } from './polygon/gains-network.staking.contract-position-fetcher';

@Module({
  providers: [
    GainsNetworkViemContractFactory,
    // Arbitrum
    ArbitrumGainsNetworkGTokenTokenFetcher,
    ArbitrumGainsNetworkStakingContractPositionFetcher,
    ArbitrumGainsNetworkLockedContractPositionFetcher,
    ArbitrumGainsNetworkStakingV2ContractPositionFetcher,
    // Polygon
    PolygonGainsNetworkStakingContractPositionFetcher,
    PolygonGainsNetworkGTokenTokenFetcher,
    PolygonGainsNetworkLockedContractPositionFetcher,
    PolygonGainsNetworkStakingV2ContractPositionFetcher,
  ],
})
export class GainsNetworkAppModule extends AbstractApp() {}
