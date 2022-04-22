import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { OlympusContractFactory } from './contracts';
import { OlympusBondContractPositionBalanceHelper } from './helpers/olympus.bond.contract-position-balance-helper';
import { OlympusBondContractPositionHelper } from './helpers/olympus.bond.contract-position-helper';
import { OlympusBridgeTokenHelper } from './helpers/olympus.bridge-token-helper';
import { OlympusAppDefinition } from './olympus.definition';

@Module({
  providers: [
    OlympusAppDefinition,
    OlympusContractFactory,
    // Arbitrum
    // ArbitrumOlympusBalanceFetcher,
    // ArbitrumOlympusGOhmTokenFetcher,
    // ArbitrumOlympusWsOhmV1TokenFetcher,
    // // Avalanche
    // AvalancheOlympusBalanceFetcher,
    // AvalancheOlympusGOhmTokenFetcher,
    // AvalancheOlympusWsOhmV1TokenFetcher,
    // // Ethereum
    // EthereumOlympusBalanceFetcher,
    // EthereumOlympusBondContractPositionFetcher,
    // EthereumOlympusSOhmTokenFetcher,
    // EthereumOlympusSOhmV1TokenFetcher,
    // EthereumOlympusWsOhmV1TokenFetcher,
    // EthereumOlympusGOhmTokenFetcher,
    // // Fantom
    // FantomOlympusBalanceFetcher,
    // FantomOlympusGOhmTokenFetcher,
    // // Polygon
    // PolygonOlympusBalanceFetcher,
    // PolygonOlympusGOhmTokenFetcher,
    // Helpers
    OlympusBridgeTokenHelper,
    OlympusBondContractPositionHelper,
    OlympusBondContractPositionBalanceHelper,
  ],
  exports: [
    // OlympusAppDefinition,
    // OlympusContractFactory,
    // OlympusBondContractPositionHelper,
    // OlympusBondContractPositionBalanceHelper,
    // OlympusBridgeTokenHelper,
  ],
})
export class OlympusAppModule extends AbstractDynamicApp<OlympusAppModule>() {}
