import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumStargateEthTokenFetcher } from './arbitrum/stargate.eth.token-fetcher';
import { ArbitrumStargateFarmContractPositionFetcher } from './arbitrum/stargate.farm.contract-position-fetcher';
import { ArbitrumStargatePoolTokenFetcher } from './arbitrum/stargate.pool.token-fetcher';
import { ArbitrumStargateVeTokenFetcher } from './arbitrum/stargate.ve.token-fetcher';
import { AvalancheStargateFarmContractPositionFetcher } from './avalanche/stargate.farm.contract-position-fetcher';
import { AvalancheStargatePoolTokenFetcher } from './avalanche/stargate.pool.token-fetcher';
import { AvalancheStargateVeTokenFetcher } from './avalanche/stargate.ve.token-fetcher';
import { BinanceSmartChainStargateFarmContractPositionFetcher } from './binance-smart-chain/stargate.farm.contract-position-fetcher';
import { BinanceSmartChainStargatePoolTokenFetcher } from './binance-smart-chain/stargate.pool.token-fetcher';
import { BinanceSmartChainStargateVeTokenFetcher } from './binance-smart-chain/stargate.ve.token-fetcher';
import { StargateContractFactory } from './contracts';
import { EthereumStargateAuctionLockedTokenFetcher } from './ethereum/stargate.auction-locked.token-fetcher';
import { EthereumStargateEthTokenFetcher } from './ethereum/stargate.eth.token-fetcher';
import { EthereumStargateFarmContractPositionFetcher } from './ethereum/stargate.farm.contract-position-fetcher';
import { EthereumStargatePoolTokenFetcher } from './ethereum/stargate.pool.token-fetcher';
import { EthereumStargateVeTokenFetcher } from './ethereum/stargate.ve.token-fetcher';
import { FantomStargateFarmContractPositionFetcher } from './fantom/stargate.farm.contract-position-fetcher';
import { FantomStargatePoolTokenFetcher } from './fantom/stargate.pool.token-fetcher';
import { FantomStargateVeTokenFetcher } from './fantom/stargate.ve.token-fetcher';
import { OptimismStargateEthTokenFetcher } from './optimism/stargate.eth.token-fetcher';
import { OptimismStargateFarmContractPositionFetcher } from './optimism/stargate.farm.contract-position-fetcher';
import { OptimismStargatePoolTokenFetcher } from './optimism/stargate.pool.token-fetcher';
import { OptimismStargateVeTokenFetcher } from './optimism/stargate.ve.token-fetcher';
import { PolygonStargateFarmContractPositionFetcher } from './polygon/stargate.farm.contract-position-fetcher';
import { PolygonStargatePoolTokenFetcher } from './polygon/stargate.pool.token-fetcher';
import { PolygonStargateVeTokenFetcher } from './polygon/stargate.ve.token-fetcher';
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
    ArbitrumStargateVeTokenFetcher,
    // Avalanche
    AvalancheStargateFarmContractPositionFetcher,
    AvalancheStargatePoolTokenFetcher,
    AvalancheStargateVeTokenFetcher,
    // Binance-smart-chain
    BinanceSmartChainStargateFarmContractPositionFetcher,
    BinanceSmartChainStargatePoolTokenFetcher,
    BinanceSmartChainStargateVeTokenFetcher,
    // Ethereum
    EthereumStargateEthTokenFetcher,
    EthereumStargateFarmContractPositionFetcher,
    EthereumStargatePoolTokenFetcher,
    EthereumStargateVeTokenFetcher,
    EthereumStargateAuctionLockedTokenFetcher,
    // Fantom
    FantomStargateFarmContractPositionFetcher,
    FantomStargatePoolTokenFetcher,
    FantomStargateVeTokenFetcher,
    // Optimism
    OptimismStargateEthTokenFetcher,
    OptimismStargateFarmContractPositionFetcher,
    OptimismStargatePoolTokenFetcher,
    OptimismStargateVeTokenFetcher,
    // Polygon
    PolygonStargateFarmContractPositionFetcher,
    PolygonStargatePoolTokenFetcher,
    PolygonStargateVeTokenFetcher,
  ],
})
export class StargateAppModule extends AbstractApp() {}
