import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VelodromeV2AddressesResolver } from './common/velodrome-v2.addresses-resolver';
import { VelodromeV2ContractFactory } from './contracts';
import { OptimismVelodromeV2BribeContractPositionFetcher } from './optimism/velodrome-v2.bribe.contract-position-fetcher';
import { OptimismVelodromeV2GaugeContractPositionFetcher } from './optimism/velodrome-v2.gauge.contract-position-fetcher';
import { OptimismVelodromeV2PoolTokenFetcher } from './optimism/velodrome-v2.pool.token-fetcher';
import { OptimismVelodromeV2VotingEscrowContractPositionFetcher } from './optimism/velodrome-v2.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    VelodromeV2ContractFactory,
    VelodromeV2AddressesResolver,
    OptimismVelodromeV2PoolTokenFetcher,
    OptimismVelodromeV2VotingEscrowContractPositionFetcher,
    OptimismVelodromeV2GaugeContractPositionFetcher,
    OptimismVelodromeV2BribeContractPositionFetcher,
  ],
})
export class VelodromeV2AppModule extends AbstractApp() {}
