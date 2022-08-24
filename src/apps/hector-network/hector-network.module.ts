import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { BinanceSmartChainHectorNetworkBscBondContractPositionBalanceFetcher } from './binance-smart-chain/hector-network.bsc-bond.contract-position-balance-fetcher';
import { BinanceSmartChainHectorNetworkBscBondContractPositionFetcher } from './binance-smart-chain/hector-network.bsc-bond.contract-position-fetcher';
import { BinanceSmartChainHectorNetworkHecTokenFetcher } from './binance-smart-chain/hector-network.hec.token-fetcher';
import { HectorNetworkContractFactory } from './contracts';
import { FantomHectorNetworkBondContractPositionBalanceFetcher } from './fantom/hector-network.bond.contract-position-balance-fetcher';
import { FantomHectorNetworkBondContractPositionFetcher } from './fantom/hector-network.bond.contract-position-fetcher';
import { FantomHectorNetworkFarmContractPositionFetcher } from './fantom/hector-network.farm.contract-position-fetcher';
import { FantomHectorNetworkFtmBondContractPositionBalanceFetcher } from './fantom/hector-network.ftm-bond.contract-position-balance-fetcher';
import { FantomHectorNetworkFtmBondContractPositionFetcher } from './fantom/hector-network.ftm-bond.contract-position-fetcher';
import { FantomHectorNetworkHecTokenFetcher } from './fantom/hector-network.hec.token-fetcher';
import { FantomHectorNetworkSHecV1TokenFetcher } from './fantom/hector-network.s-hec-v1.token-fetcher';
import { FantomHectorNetworkSHecV2TokenFetcher } from './fantom/hector-network.s-hec-v2.token-fetcher';
import { FantomHectorNetworkStakeBondContractPositionBalanceFetcher } from './fantom/hector-network.stake-bond.contract-position-balance-fetcher';
import { FantomHectorNetworkStakeBondContractPositionFetcher } from './fantom/hector-network.stake-bond.contract-position-fetcher';
import { FantomHectorNetworkWsHecTokenFetcher } from './fantom/hector-network.ws-hec.token-fetcher';
import { HectorNetworkAppDefinition, HECTOR_NETWORK_DEFINITION } from './hector-network.definition';

@Register.AppModule({
  appId: HECTOR_NETWORK_DEFINITION.id,
  imports: [OlympusAppModule],
  providers: [
    BinanceSmartChainHectorNetworkBscBondContractPositionBalanceFetcher,
    BinanceSmartChainHectorNetworkBscBondContractPositionFetcher,
    BinanceSmartChainHectorNetworkHecTokenFetcher,
    FantomHectorNetworkBondContractPositionBalanceFetcher,
    FantomHectorNetworkBondContractPositionFetcher,
    FantomHectorNetworkFarmContractPositionFetcher,
    FantomHectorNetworkFtmBondContractPositionBalanceFetcher,
    FantomHectorNetworkFtmBondContractPositionFetcher,
    FantomHectorNetworkHecTokenFetcher,
    FantomHectorNetworkSHecV1TokenFetcher,
    FantomHectorNetworkSHecV2TokenFetcher,
    FantomHectorNetworkStakeBondContractPositionBalanceFetcher,
    FantomHectorNetworkStakeBondContractPositionFetcher,
    FantomHectorNetworkWsHecTokenFetcher,
    HectorNetworkAppDefinition,
    HectorNetworkContractFactory,
  ],
})
export class HectorNetworkAppModule extends AbstractApp() {}
