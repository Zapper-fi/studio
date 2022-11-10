import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumOlympusGOhmTokenFetcher } from './arbitrum/olympus.g-ohm.token-fetcher';
import { ArbitrumOlympusWsOhmV1TokenFetcher } from './arbitrum/olympus.ws-ohm-v1.token-fetcher';
import { AvalancheOlympusGOhmTokenFetcher } from './avalanche/olympus.g-ohm.token-fetcher';
import { AvalancheOlympusWsOhmV1TokenFetcher } from './avalanche/olympus.ws-ohm-v1.token-fetcher';
import { OlympusContractFactory } from './contracts';
import { EthereumOlympusBondContractPositionFetcher } from './ethereum/olympus.bond.contract-position-fetcher';
import { EthereumOlympusGOhmTokenFetcher } from './ethereum/olympus.g-ohm.token-fetcher';
import { EthereumOlympusSOhmTokenFetcher } from './ethereum/olympus.s-ohm.token-fetcher';
import { FantomOlympusGOhmTokenFetcher } from './fantom/olympus.g-ohm.token-fetcher';
import { OlympusBondV1ContractPositionBalanceHelper } from './helpers/olympus.bond-v1.contract-position-balance-helper';
import { OlympusBondV2ContractPositionBalanceHelper } from './helpers/olympus.bond-v2.contract-position-balance-helper';
import { OlympusBondContractPositionHelper } from './helpers/olympus.bond.contract-position-helper';
import { OlympusBridgeTokenHelper } from './helpers/olympus.bridge-token-helper';
import { OlympusAppDefinition, OLYMPUS_DEFINITION } from './olympus.definition';
import { PolygonOlympusGOhmTokenFetcher } from './polygon/olympus.g-ohm.token-fetcher';

@Register.AppModule({
  appId: OLYMPUS_DEFINITION.id,
  providers: [
    OlympusAppDefinition,
    OlympusContractFactory,
    // Arbitrum
    ArbitrumOlympusGOhmTokenFetcher,
    ArbitrumOlympusWsOhmV1TokenFetcher,
    // // Avalanche
    AvalancheOlympusGOhmTokenFetcher,
    AvalancheOlympusWsOhmV1TokenFetcher,
    // // Ethereum
    EthereumOlympusBondContractPositionFetcher,
    EthereumOlympusSOhmTokenFetcher,
    EthereumOlympusGOhmTokenFetcher,
    // // Fantom
    FantomOlympusGOhmTokenFetcher,
    // // Polygon
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
export class OlympusAppModule extends AbstractApp() {}
