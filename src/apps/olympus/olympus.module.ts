import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { ArbitrumOlympusBalanceFetcher } from './arbitrum/olympus.balance-fetcher';
import { ArbitrumOlympusGOhmTokenFetcher } from './arbitrum/olympus.g-ohm.token-fetcher';
import { ArbitrumOlympusWsOhmV1TokenFetcher } from './arbitrum/olympus.ws-ohm-v1.token-fetcher';
import { AvalancheOlympusBalanceFetcher } from './avalanche/olympus.balance-fetcher';
import { AvalancheOlympusGOhmTokenFetcher } from './avalanche/olympus.g-ohm.token-fetcher';
import { AvalancheOlympusWsOhmV1TokenFetcher } from './avalanche/olympus.ws-ohm-v1.token-fetcher';
import { OlympusContractFactory } from './contracts';
import { EthereumOlympusBalanceFetcher } from './ethereum/olympus.balance-fetcher';
import { EthereumOlympusBondContractPositionFetcher } from './ethereum/olympus.bond.contract-position-fetcher';
import { EthereumOlympusGOhmTokenFetcher } from './ethereum/olympus.g-ohm.token-fetcher';
import { EthereumOlympusSOhmV1TokenFetcher } from './ethereum/olympus.s-ohm-v1.token-fetcher';
import { EthereumOlympusSOhmTokenFetcher } from './ethereum/olympus.s-ohm.token-fetcher';
import { EthereumOlympusWsOhmV1TokenFetcher } from './ethereum/olympus.ws-ohm-v1.token-fetcher';
import { FantomOlympusBalanceFetcher } from './fantom/olympus.balance-fetcher';
import { FantomOlympusGOhmTokenFetcher } from './fantom/olympus.g-ohm.token-fetcher';
import { OlympusBondV1ContractPositionBalanceHelper } from './helpers/olympus.bond-v1.contract-position-balance-helper';
import { OlympusBondV2ContractPositionBalanceHelper } from './helpers/olympus.bond-v2.contract-position-balance-helper';
import { OlympusBondContractPositionHelper } from './helpers/olympus.bond.contract-position-helper';
import { OlympusBridgeTokenHelper } from './helpers/olympus.bridge-token-helper';
import { OlympusAppDefinition } from './olympus.definition';
import { PolygonOlympusBalanceFetcher } from './polygon/olympus.balance-fetcher';
import { PolygonOlympusGOhmTokenFetcher } from './polygon/olympus.g-ohm.token-fetcher';

@Module({
  providers: [
    OlympusAppDefinition,
    OlympusContractFactory,
    // Arbitrum
    ArbitrumOlympusBalanceFetcher,
    ArbitrumOlympusGOhmTokenFetcher,
    ArbitrumOlympusWsOhmV1TokenFetcher,
    // // Avalanche
    AvalancheOlympusBalanceFetcher,
    AvalancheOlympusGOhmTokenFetcher,
    AvalancheOlympusWsOhmV1TokenFetcher,
    // // Ethereum
    EthereumOlympusBalanceFetcher,
    EthereumOlympusBondContractPositionFetcher,
    EthereumOlympusSOhmTokenFetcher,
    EthereumOlympusSOhmV1TokenFetcher,
    EthereumOlympusWsOhmV1TokenFetcher,
    EthereumOlympusGOhmTokenFetcher,
    // // Fantom
    FantomOlympusBalanceFetcher,
    FantomOlympusGOhmTokenFetcher,
    // // Polygon
    PolygonOlympusBalanceFetcher,
    PolygonOlympusGOhmTokenFetcher,
    // Helpers
    OlympusBridgeTokenHelper,
    OlympusBondContractPositionHelper,
    OlympusBondV1ContractPositionBalanceHelper,
    OlympusBondV2ContractPositionBalanceHelper,
  ],
  exports: [
    OlympusAppDefinition,
    OlympusContractFactory,
    OlympusBondContractPositionHelper,
    OlympusBondV1ContractPositionBalanceHelper,
    OlympusBondV2ContractPositionBalanceHelper,
    OlympusBridgeTokenHelper,
  ],
})
export class OlympusAppModule extends AbstractDynamicApp<OlympusAppModule>() {}
