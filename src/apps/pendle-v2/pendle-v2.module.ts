import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PendleV2ContractFactory } from './contracts';
// Ethereum
import { EthereumPendleV2PoolTokenFetcher } from './ethereum/pendle-v2.pool.token-fetcher';
import { EthereumPendleV2PrincipalTokenFetcher } from './ethereum/pendle-v2.principal.token-fetcher';
import { EthereumPendleV2StandardizedYieldTokenFetcher } from './ethereum/pendle-v2.standardized-yield.token-fetcher';
import { EthereumPendleV2VotingEscrowContractPositionFetcher } from './ethereum/pendle-v2.voting-escrow.contract-position-fetcher';
import { EthereumPendleV2YieldTokenFetcher } from './ethereum/pendle-v2.yield.token-fetcher';
// Arbitrum
import { ArbitrumPendleV2PoolTokenFetcher } from './arbitrum/pendle-v2.pool.token-fetcher';
import { ArbitrumPendleV2PrincipalTokenFetcher } from './arbitrum/pendle-v2.principal.token-fetcher';
import { ArbitrumPendleV2StandardizedYieldTokenFetcher } from './arbitrum/pendle-v2.standardized-yield.token-fetcher';
import { ArbitrumPendleV2YieldTokenFetcher } from './arbitrum/pendle-v2.yield.token-fetcher';

@Module({
  providers: [
    PendleV2ContractFactory,
    // Ethereum
    EthereumPendleV2PoolTokenFetcher,
    EthereumPendleV2PrincipalTokenFetcher,
    EthereumPendleV2StandardizedYieldTokenFetcher,
    EthereumPendleV2VotingEscrowContractPositionFetcher,
    EthereumPendleV2YieldTokenFetcher,
    // Arbitrum
    ArbitrumPendleV2PoolTokenFetcher,
    ArbitrumPendleV2PrincipalTokenFetcher,
    ArbitrumPendleV2StandardizedYieldTokenFetcher,
    ArbitrumPendleV2YieldTokenFetcher,
  ],
})
export class PendleV2AppModule extends AbstractApp() {}
