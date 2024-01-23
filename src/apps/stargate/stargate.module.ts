import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumStargateFarmContractPositionFetcher } from './arbitrum/stargate.farm.contract-position-fetcher';
import { ArbitrumStargateLpStakingContractPositionFetcher } from './arbitrum/stargate.lp-staking.contract-position-fetcher';
import { ArbitrumStargatePoolTokenFetcher } from './arbitrum/stargate.pool.token-fetcher';
import { ArbitrumStargateVotingEscrowContractPositionFetcher } from './arbitrum/stargate.voting-escrow.contract-position-fetcher';
import { AvalancheStargateFarmContractPositionFetcher } from './avalanche/stargate.farm.contract-position-fetcher';
import { AvalancheStargatePoolTokenFetcher } from './avalanche/stargate.pool.token-fetcher';
import { AvalancheStargateVotingEscrowContractPositionFetcher } from './avalanche/stargate.voting-escrow.contract-position-fetcher';
import { BaseStargateFarmContractPositionFetcher } from './base/stargate.farm.contract-position-fetcher';
import { BaseStargatePoolTokenFetcher } from './base/stargate.pool.token-fetcher';
import { BinanceSmartChainStargateFarmContractPositionFetcher } from './binance-smart-chain/stargate.farm.contract-position-fetcher';
import { BinanceSmartChainStargatePoolTokenFetcher } from './binance-smart-chain/stargate.pool.token-fetcher';
import { BinanceSmartChainStargateVotingEscrowContractPositionFetcher } from './binance-smart-chain/stargate.voting-escrow.contract-position-fetcher';
import { StargateViemContractFactory } from './contracts';
import { EthereumStargateFarmContractPositionFetcher } from './ethereum/stargate.farm.contract-position-fetcher';
import { EthereumStargatePoolTokenFetcher } from './ethereum/stargate.pool.token-fetcher';
import { EthereumStargateVotingEscrowContractPositionFetcher } from './ethereum/stargate.voting-escrow.contract-position-fetcher';
import { FantomStargateFarmContractPositionFetcher } from './fantom/stargate.farm.contract-position-fetcher';
import { FantomStargatePoolTokenFetcher } from './fantom/stargate.pool.token-fetcher';
import { FantomStargateVotingEscrowContractPositionFetcher } from './fantom/stargate.voting-escrow.contract-position-fetcher';
import { OptimismStargateFarmContractPositionFetcher } from './optimism/stargate.farm.contract-position-fetcher';
import { OptimismStargateLpStakingContractPositionFetcher } from './optimism/stargate.lp-staking.contract-position-fetcher';
import { OptimismStargatePoolTokenFetcher } from './optimism/stargate.pool.token-fetcher';
import { OptimismStargateVotingEscrowContractPositionFetcher } from './optimism/stargate.voting-escrow.contract-position-fetcher';
import { PolygonStargateFarmContractPositionFetcher } from './polygon/stargate.farm.contract-position-fetcher';
import { PolygonStargatePoolTokenFetcher } from './polygon/stargate.pool.token-fetcher';
import { PolygonStargateVotingEscrowContractPositionFetcher } from './polygon/stargate.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    StargateViemContractFactory,
    // Arbitrum
    ArbitrumStargateFarmContractPositionFetcher,
    ArbitrumStargatePoolTokenFetcher,
    ArbitrumStargateVotingEscrowContractPositionFetcher,
    ArbitrumStargateLpStakingContractPositionFetcher,
    // Avalanche
    AvalancheStargateFarmContractPositionFetcher,
    AvalancheStargatePoolTokenFetcher,
    AvalancheStargateVotingEscrowContractPositionFetcher,
    // Base
    BaseStargateFarmContractPositionFetcher,
    BaseStargatePoolTokenFetcher,
    // Binance-smart-chain
    BinanceSmartChainStargateFarmContractPositionFetcher,
    BinanceSmartChainStargatePoolTokenFetcher,
    BinanceSmartChainStargateVotingEscrowContractPositionFetcher,
    // Ethereum
    EthereumStargateFarmContractPositionFetcher,
    EthereumStargatePoolTokenFetcher,
    EthereumStargateVotingEscrowContractPositionFetcher,
    // Fantom
    FantomStargateFarmContractPositionFetcher,
    FantomStargatePoolTokenFetcher,
    FantomStargateVotingEscrowContractPositionFetcher,
    // Optimism
    OptimismStargateFarmContractPositionFetcher,
    OptimismStargatePoolTokenFetcher,
    OptimismStargateVotingEscrowContractPositionFetcher,
    OptimismStargateLpStakingContractPositionFetcher,
    // Polygon
    PolygonStargateFarmContractPositionFetcher,
    PolygonStargatePoolTokenFetcher,
    PolygonStargateVotingEscrowContractPositionFetcher,
  ],
})
export class StargateAppModule extends AbstractApp() {}
