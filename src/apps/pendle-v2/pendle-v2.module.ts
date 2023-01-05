import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PendleV2ContractFactory } from './contracts';
import { EthereumPendleV2PoolTokenFetcher } from './ethereum/pendle-v2.pool.token-fetcher';
import { EthereumPendleV2PrincipalTokenFetcher } from './ethereum/pendle-v2.principal.token-fetcher';
import { EthereumPendleV2StandardizedYieldTokenFetcher } from './ethereum/pendle-v2.standardized-yield.token-fetcher';
import { EthereumPendleV2VotingEscrowContractPositionFetcher } from './ethereum/pendle-v2.voting-escrow.contract-position-fetcher';
import { EthereumPendleV2YieldTokenFetcher } from './ethereum/pendle-v2.yield.token-fetcher';
import { PendleV2AppDefinition } from './pendle-v2.definition';

@Module({
  providers: [
    EthereumPendleV2PoolTokenFetcher,
    EthereumPendleV2PrincipalTokenFetcher,
    EthereumPendleV2StandardizedYieldTokenFetcher,
    EthereumPendleV2VotingEscrowContractPositionFetcher,
    EthereumPendleV2YieldTokenFetcher,
    PendleV2AppDefinition,
    PendleV2ContractFactory,
  ],
})
export class PendleV2AppModule extends AbstractApp() {}
