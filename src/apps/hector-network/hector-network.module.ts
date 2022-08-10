import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { HectorNetworkContractFactory } from './contracts';
import { FantomHectorNetworkBondContractPositionBalanceFetcher } from './fantom/hector-network.bond.contract-position-balance-fetcher';
import { FantomHectorNetworkBondContractPositionFetcher } from './fantom/hector-network.bond.contract-position-fetcher';
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
    HectorNetworkAppDefinition,
    HectorNetworkContractFactory,
    FantomHectorNetworkSHecV1TokenFetcher,
    FantomHectorNetworkSHecV2TokenFetcher,
    FantomHectorNetworkWsHecTokenFetcher,
    FantomHectorNetworkBondContractPositionFetcher,
    FantomHectorNetworkBondContractPositionBalanceFetcher,
    FantomHectorNetworkStakeBondContractPositionFetcher,
    FantomHectorNetworkStakeBondContractPositionBalanceFetcher,
  ],
})
export class HectorNetworkAppModule extends AbstractApp() {}
