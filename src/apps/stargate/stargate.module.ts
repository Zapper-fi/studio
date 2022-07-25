import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumStargateBalanceFetcher } from './arbitrum/stargate.balance-fetcher';
import { ArbitrumStargateEthTokenFetcher } from './arbitrum/stargate.eth.token-fetcher';
import { ArbitrumStargateFarmContractPositionFetcher } from './arbitrum/stargate.farm.contract-position-fetcher';
import { ArbitrumStargatePoolTokenFetcher } from './arbitrum/stargate.pool.token-fetcher';
import { ArbitrumStargateVeTokenFetcher } from './arbitrum/stargate.ve.token-fetcher';
import { AvalancheStargateBalanceFetcher } from './avalanche/stargate.balance-fetcher';
import { AvalancheStargateFarmContractPositionFetcher } from './avalanche/stargate.farm.contract-position-fetcher';
import { AvalancheStargatePoolTokenFetcher } from './avalanche/stargate.pool.token-fetcher';
import { AvalancheStargateVeTokenFetcher } from './avalanche/stargate.ve.token-fetcher';
import { BinanceSmartChainStargateBalanceFetcher } from './binance-smart-chain/stargate.balance-fetcher';
import { BinanceSmartChainStargateFarmContractPositionFetcher } from './binance-smart-chain/stargate.farm.contract-position-fetcher';
import { BinanceSmartChainStargatePoolTokenFetcher } from './binance-smart-chain/stargate.pool.token-fetcher';
import { BinanceSmartChainStargateVeTokenFetcher } from './binance-smart-chain/stargate.ve.token-fetcher';
import { StargateContractFactory } from './contracts';
import { EthereumStargateBalanceFetcher } from './ethereum/stargate.balance-fetcher';
import { EthereumStargateEthTokenFetcher } from './ethereum/stargate.eth.token-fetcher';
import { EthereumStargateFarmContractPositionFetcher } from './ethereum/stargate.farm.contract-position-fetcher';
import { EthereumStargatePoolTokenFetcher } from './ethereum/stargate.pool.token-fetcher';
import { EthereumStargateVeTokenFetcher } from './ethereum/stargate.ve.token-fetcher';
import { FantomStargateBalanceFetcher } from './fantom/stargate.balance-fetcher';
import { FantomStargateFarmContractPositionFetcher } from './fantom/stargate.farm.contract-position-fetcher';
import { FantomStargatePoolTokenFetcher } from './fantom/stargate.pool.token-fetcher';
import { FantomStargateVeTokenFetcher } from './fantom/stargate.ve.token-fetcher';
import { StargatePoolTokenHelper } from './helpers/stargate.pool.token-helper';
import { OptimismStargateBalanceFetcher } from './optimism/stargate.balance-fetcher';
import { OptimismStargateEthTokenFetcher } from './optimism/stargate.eth.token-fetcher';
import { OptimismStargateFarmContractPositionFetcher } from './optimism/stargate.farm.contract-position-fetcher';
import { OptimismStargatePoolTokenFetcher } from './optimism/stargate.pool.token-fetcher';
import { OptimismStargateVeTokenFetcher } from './optimism/stargate.ve.token-fetcher';
import { PolygonStargateBalanceFetcher } from './polygon/stargate.balance-fetcher';
import { PolygonStargateFarmContractPositionFetcher } from './polygon/stargate.farm.contract-position-fetcher';
import { PolygonStargatePoolTokenFetcher } from './polygon/stargate.pool.token-fetcher';
import { PolygonStargateVeTokenFetcher } from './polygon/stargate.ve.token-fetcher';
import { StargateAppDefinition, STARGATE_DEFINITION } from './stargate.definition';

@Register.AppModule({
  appId: STARGATE_DEFINITION.id,
  providers: [
    ArbitrumStargateBalanceFetcher,
    ArbitrumStargateEthTokenFetcher,
    ArbitrumStargateFarmContractPositionFetcher,
    ArbitrumStargatePoolTokenFetcher,
    ArbitrumStargateVeTokenFetcher,
    AvalancheStargateBalanceFetcher,
    AvalancheStargateFarmContractPositionFetcher,
    AvalancheStargatePoolTokenFetcher,
    AvalancheStargateVeTokenFetcher,
    BinanceSmartChainStargateBalanceFetcher,
    BinanceSmartChainStargateFarmContractPositionFetcher,
    BinanceSmartChainStargatePoolTokenFetcher,
    BinanceSmartChainStargateVeTokenFetcher,
    EthereumStargateBalanceFetcher,
    EthereumStargateEthTokenFetcher,
    EthereumStargateFarmContractPositionFetcher,
    EthereumStargatePoolTokenFetcher,
    EthereumStargateVeTokenFetcher,
    FantomStargateBalanceFetcher,
    FantomStargateFarmContractPositionFetcher,
    FantomStargatePoolTokenFetcher,
    FantomStargateVeTokenFetcher,
    OptimismStargateBalanceFetcher,
    OptimismStargateEthTokenFetcher,
    OptimismStargateFarmContractPositionFetcher,
    OptimismStargatePoolTokenFetcher,
    OptimismStargateVeTokenFetcher,
    PolygonStargateBalanceFetcher,
    PolygonStargateFarmContractPositionFetcher,
    PolygonStargatePoolTokenFetcher,
    PolygonStargateVeTokenFetcher,
    StargateAppDefinition,
    StargateContractFactory,
    StargatePoolTokenHelper,
  ],
})
export class StargateAppModule extends AbstractApp() {}
