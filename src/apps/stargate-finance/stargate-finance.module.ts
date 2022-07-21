import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumStargateFinanceBalanceFetcher } from './arbitrum/stargate-finance.balance-fetcher';
import { ArbitrumStargateFinanceEthTokenFetcher } from './arbitrum/stargate-finance.eth.token-fetcher';
import { ArbitrumStargateFinanceFarmContractPositionFetcher } from './arbitrum/stargate-finance.farm.contract-position-fetcher';
import { ArbitrumStargateFinancePoolTokenFetcher } from './arbitrum/stargate-finance.pool.token-fetcher';
import { ArbitrumStargateFinanceVeTokenFetcher } from './arbitrum/stargate-finance.ve.token-fetcher';
import { AvalancheStargateFinanceBalanceFetcher } from './avalanche/stargate-finance.balance-fetcher';
import { AvalancheStargateFinanceFarmContractPositionFetcher } from './avalanche/stargate-finance.farm.contract-position-fetcher';
import { AvalancheStargateFinancePoolTokenFetcher } from './avalanche/stargate-finance.pool.token-fetcher';
import { AvalancheStargateFinanceVeTokenFetcher } from './avalanche/stargate-finance.ve.token-fetcher';
import { BinanceSmartChainStargateFinanceBalanceFetcher } from './binance-smart-chain/stargate-finance.balance-fetcher';
import { BinanceSmartChainStargateFinanceFarmContractPositionFetcher } from './binance-smart-chain/stargate-finance.farm.contract-position-fetcher';
import { BinanceSmartChainStargateFinancePoolTokenFetcher } from './binance-smart-chain/stargate-finance.pool.token-fetcher';
import { BinanceSmartChainStargateFinanceVeTokenFetcher } from './binance-smart-chain/stargate-finance.ve.token-fetcher';
import { StargateFinanceContractFactory } from './contracts';
import { EthereumStargateFinanceBalanceFetcher } from './ethereum/stargate-finance.balance-fetcher';
import { EthereumStargateFinanceEthTokenFetcher } from './ethereum/stargate-finance.eth.token-fetcher';
import { EthereumStargateFinanceFarmContractPositionFetcher } from './ethereum/stargate-finance.farm.contract-position-fetcher';
import { EthereumStargateFinancePoolTokenFetcher } from './ethereum/stargate-finance.pool.token-fetcher';
import { EthereumStargateFinanceVeTokenFetcher } from './ethereum/stargate-finance.ve.token-fetcher';
import { FantomStargateFinanceBalanceFetcher } from './fantom/stargate-finance.balance-fetcher';
import { FantomStargateFinanceFarmContractPositionFetcher } from './fantom/stargate-finance.farm.contract-position-fetcher';
import { FantomStargateFinancePoolTokenFetcher } from './fantom/stargate-finance.pool.token-fetcher';
import { FantomStargateFinanceVeTokenFetcher } from './fantom/stargate-finance.ve.token-fetcher';
import {
  StargateFinanceBalanceHelper,
  StargateFinanceEthTokenHelper,
  StargateFinanceFarmHelper,
  StargateFinancePoolTokenHelper,
  StargateFinanceVeTokenHelper,
} from './helpers';
import { OptimismStargateFinanceBalanceFetcher } from './optimism/stargate-finance.balance-fetcher';
import { OptimismStargateFinanceEthTokenFetcher } from './optimism/stargate-finance.eth.token-fetcher';
import { OptimismStargateFinanceFarmContractPositionFetcher } from './optimism/stargate-finance.farm.contract-position-fetcher';
import { OptimismStargateFinancePoolTokenFetcher } from './optimism/stargate-finance.pool.token-fetcher';
import { OptimismStargateFinanceVeTokenFetcher } from './optimism/stargate-finance.ve.token-fetcher';
import { PolygonStargateFinanceBalanceFetcher } from './polygon/stargate-finance.balance-fetcher';
import { PolygonStargateFinanceFarmContractPositionFetcher } from './polygon/stargate-finance.farm.contract-position-fetcher';
import { PolygonStargateFinancePoolTokenFetcher } from './polygon/stargate-finance.pool.token-fetcher';
import { PolygonStargateFinanceVeTokenFetcher } from './polygon/stargate-finance.ve.token-fetcher';
import { StargateFinanceAppDefinition, STARGATE_FINANCE_DEFINITION } from './stargate-finance.definition';

@Register.AppModule({
  appId: STARGATE_FINANCE_DEFINITION.id,
  providers: [
    ArbitrumStargateFinanceBalanceFetcher,
    ArbitrumStargateFinanceEthTokenFetcher,
    ArbitrumStargateFinanceFarmContractPositionFetcher,
    ArbitrumStargateFinancePoolTokenFetcher,
    ArbitrumStargateFinanceVeTokenFetcher,
    AvalancheStargateFinanceBalanceFetcher,
    AvalancheStargateFinanceFarmContractPositionFetcher,
    AvalancheStargateFinancePoolTokenFetcher,
    AvalancheStargateFinanceVeTokenFetcher,
    BinanceSmartChainStargateFinanceBalanceFetcher,
    BinanceSmartChainStargateFinanceFarmContractPositionFetcher,
    BinanceSmartChainStargateFinancePoolTokenFetcher,
    BinanceSmartChainStargateFinanceVeTokenFetcher,
    EthereumStargateFinanceBalanceFetcher,
    EthereumStargateFinanceEthTokenFetcher,
    EthereumStargateFinanceFarmContractPositionFetcher,
    EthereumStargateFinancePoolTokenFetcher,
    EthereumStargateFinanceVeTokenFetcher,
    FantomStargateFinanceBalanceFetcher,
    FantomStargateFinanceFarmContractPositionFetcher,
    FantomStargateFinancePoolTokenFetcher,
    FantomStargateFinanceVeTokenFetcher,
    OptimismStargateFinanceBalanceFetcher,
    OptimismStargateFinanceEthTokenFetcher,
    OptimismStargateFinanceFarmContractPositionFetcher,
    OptimismStargateFinancePoolTokenFetcher,
    OptimismStargateFinanceVeTokenFetcher,
    PolygonStargateFinanceBalanceFetcher,
    PolygonStargateFinanceFarmContractPositionFetcher,
    PolygonStargateFinancePoolTokenFetcher,
    PolygonStargateFinanceVeTokenFetcher,
    StargateFinanceAppDefinition,
    StargateFinanceBalanceHelper,
    StargateFinanceContractFactory,
    StargateFinanceEthTokenHelper,
    StargateFinanceFarmHelper,
    StargateFinancePoolTokenHelper,
    StargateFinanceVeTokenHelper,
  ],
})
export class StargateFinanceAppModule extends AbstractApp() {}
