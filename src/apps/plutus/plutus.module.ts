import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPlutusFarmPlsDpxLpContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx-lp.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsDpxV2ContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx-v2.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsDpxContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsJonesLpContractPositionFetcher } from './arbitrum/plutus.farm-pls-jones-lp.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsJonesContractPositionFetcher } from './arbitrum/plutus.farm-pls-jones.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsContractPositionFetcher } from './arbitrum/plutus.farm-pls.contract-position-fetcher';
import { ArbitrumPlutusFarmPlvGlpContractPositionFetcher } from './arbitrum/plutus.farm-plv-glp.contract-position-fetcher';
import { ArbitrumPlutusLockContractPositionFetcher } from './arbitrum/plutus.lock.contract-position-fetcher';
import { ArbitrumPlutusPlsDpxTokenFetcher } from './arbitrum/plutus.pls-dpx.token-fetcher';
import { ArbitrumPlutusPlsJonesTokenFetcher } from './arbitrum/plutus.pls-jones.token-fetcher';
import { ArbitrumPlutusPlvGlpTokenFetcher } from './arbitrum/plutus.plv-glp.token-fetcher';
import { ArbitrumPlutusTgeClaimableContractPositionFetcher } from './arbitrum/plutus.tge-claimable.contract-position-fetcher';
import { PlutusContractFactory } from './contracts';
import { PlutusAppDefinition, PLUTUS_DEFINITION } from './plutus.definition';

@Register.AppModule({
  appId: PLUTUS_DEFINITION.id,
  providers: [
    ArbitrumPlutusFarmPlsDpxLpContractPositionFetcher,
    ArbitrumPlutusFarmPlsDpxV2ContractPositionFetcher,
    ArbitrumPlutusFarmPlsDpxContractPositionFetcher,
    ArbitrumPlutusFarmPlsJonesLpContractPositionFetcher,
    ArbitrumPlutusFarmPlsJonesContractPositionFetcher,
    ArbitrumPlutusFarmPlsContractPositionFetcher,
    ArbitrumPlutusFarmPlvGlpContractPositionFetcher,
    ArbitrumPlutusLockContractPositionFetcher,
    ArbitrumPlutusPlsDpxTokenFetcher,
    ArbitrumPlutusPlsJonesTokenFetcher,
    ArbitrumPlutusPlvGlpTokenFetcher,
    ArbitrumPlutusTgeClaimableContractPositionFetcher,
    PlutusAppDefinition,
    PlutusContractFactory,
  ],
})
export class PlutusAppModule extends AbstractApp() {}
