import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumStargateEthTokenFetcher } from './arbitrum/stargate.eth.token-fetcher';
import { ArbitrumStargateFarmContractPositionFetcher } from './arbitrum/stargate.farm.contract-position-fetcher';
import { ArbitrumStargatePoolTokenFetcher } from './arbitrum/stargate.pool.token-fetcher';
import { ArbitrumStargateVotingEscrowContractPositionFetcher } from './arbitrum/stargate.voting-escrow.contract-position-fetcher';
import { AvalancheStargateFarmContractPositionFetcher } from './avalanche/stargate.farm.contract-position-fetcher';
import { AvalancheStargatePoolTokenFetcher } from './avalanche/stargate.pool.token-fetcher';
import { AvalancheStargateVotingEscrowContractPositionFetcher } from './avalanche/stargate.voting-escrow.contract-position-fetcher';
import { BinanceSmartChainStargateFarmContractPositionFetcher } from './binance-smart-chain/stargate.farm.contract-position-fetcher';
import { BinanceSmartChainStargatePoolTokenFetcher } from './binance-smart-chain/stargate.pool.token-fetcher';
import { BinanceSmartChainStargateVotingEscrowContractPositionFetcher } from './binance-smart-chain/stargate.voting-escrow.contract-position-fetcher';
import { StargateContractFactory } from './contracts';
import { EthereumStargateAuctionLockedTokenFetcher } from './ethereum/stargate.auction-locked.token-fetcher';
import { EthereumStargateEthTokenFetcher } from './ethereum/stargate.eth.token-fetcher';
import { EthereumStargateFarmContractPositionFetcher } from './ethereum/stargate.farm.contract-position-fetcher';
import { EthereumStargatePoolTokenFetcher } from './ethereum/stargate.pool.token-fetcher';
import { EthereumStargateVotingEscrowContractPositionFetcher } from './ethereum/stargate.voting-escrow.contract-position-fetcher';
import { FantomStargateFarmContractPositionFetcher } from './fantom/stargate.farm.contract-position-fetcher';
import { FantomStargatePoolTokenFetcher } from './fantom/stargate.pool.token-fetcher';
import { FantomStargateVotingEscrowContractPositionFetcher } from './fantom/stargate.voting-escrow.contract-position-fetcher';
import { OptimismStargateEthTokenFetcher } from './optimism/stargate.eth.token-fetcher';
import { OptimismStargateFarmContractPositionFetcher } from './optimism/stargate.farm.contract-position-fetcher';
import { OptimismStargatePoolTokenFetcher } from './optimism/stargate.pool.token-fetcher';
import { OptimismStargateVotingEscrowContractPositionFetcher } from './optimism/stargate.voting-escrow.contract-position-fetcher';
import { PolygonStargateFarmContractPositionFetcher } from './polygon/stargate.farm.contract-position-fetcher';
import { PolygonStargatePoolTokenFetcher } from './polygon/stargate.pool.token-fetcher';
import { PolygonStargateVotingEscrowContractPositionFetcher } from './polygon/stargate.voting-escrow.contract-position-fetcher';
import { StargateAppDefinition, STARGATE_DEFINITION } from './stargate.definition';

@Register.AppModule({
  appId: STARGATE_DEFINITION.id,
  providers: [
    StargateAppDefinition,
    StargateContractFactory,
    // Arbitrum
    ArbitrumStargateEthTokenFetcher,
    ArbitrumStargateFarmContractPositionFetcher,
    ArbitrumStargatePoolTokenFetcher,
    ArbitrumStargateVotingEscrowContractPositionFetcher,
    // Avalanche
    AvalancheStargateFarmContractPositionFetcher,
    AvalancheStargatePoolTokenFetcher,
    AvalancheStargateVotingEscrowContractPositionFetcher,
    // Binance-smart-chain
    BinanceSmartChainStargateFarmContractPositionFetcher,
    BinanceSmartChainStargatePoolTokenFetcher,
    BinanceSmartChainStargateVotingEscrowContractPositionFetcher,
    // Ethereum
    EthereumStargateEthTokenFetcher,
    EthereumStargateFarmContractPositionFetcher,
    EthereumStargatePoolTokenFetcher,
    EthereumStargateVotingEscrowContractPositionFetcher,
    EthereumStargateAuctionLockedTokenFetcher,
    // Fantom
    FantomStargateFarmContractPositionFetcher,
    FantomStargatePoolTokenFetcher,
    FantomStargateVotingEscrowContractPositionFetcher,
    // Optimism
    OptimismStargateEthTokenFetcher,
    OptimismStargateFarmContractPositionFetcher,
    OptimismStargatePoolTokenFetcher,
    OptimismStargateVotingEscrowContractPositionFetcher,
    // Polygon
    PolygonStargateFarmContractPositionFetcher,
    PolygonStargatePoolTokenFetcher,
    PolygonStargateVotingEscrowContractPositionFetcher,
  ],
})
export class StargateAppModule extends AbstractApp() {}
