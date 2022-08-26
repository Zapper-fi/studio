import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainHectorNetworkBondContractPositionFetcher } from './binance-smart-chain/hector-network.bond.contract-position-fetcher';
import { HectorNetworkContractFactory } from './contracts';
import { FantomHectorNetworkBondContractPositionFetcher } from './fantom/hector-network.bond.contract-position-fetcher';
import { FantomHectorNetworkFarmContractPositionFetcher } from './fantom/hector-network.farm.contract-position-fetcher';
import { FantomHectorNetworkSHecV1TokenFetcher } from './fantom/hector-network.s-hec-v1.token-fetcher';
import { FantomHectorNetworkSHecV2TokenFetcher } from './fantom/hector-network.s-hec-v2.token-fetcher';
import { FantomHectorNetworkStakeBondContractPositionFetcher } from './fantom/hector-network.stake-bond.contract-position-fetcher';
import { FantomHectorNetworkWsHecTokenFetcher } from './fantom/hector-network.ws-hec.token-fetcher';
import { HectorNetworkAppDefinition, HECTOR_NETWORK_DEFINITION } from './hector-network.definition';

@Register.AppModule({
  appId: HECTOR_NETWORK_DEFINITION.id,
  providers: [
    BinanceSmartChainHectorNetworkBondContractPositionFetcher,
    FantomHectorNetworkBondContractPositionFetcher,
    FantomHectorNetworkFarmContractPositionFetcher,
    FantomHectorNetworkSHecV1TokenFetcher,
    FantomHectorNetworkSHecV2TokenFetcher,
    FantomHectorNetworkStakeBondContractPositionFetcher,
    FantomHectorNetworkWsHecTokenFetcher,
    HectorNetworkAppDefinition,
    HectorNetworkContractFactory,
  ],
})
export class HectorNetworkAppModule extends AbstractApp() {}
