import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPlutusBalanceFetcher } from './arbitrum/plutus.balance-fetcher';
import { ArbitrumPlutusDpxContractPositionFetcher } from './arbitrum/plutus.dpx.contract-position-fetcher';
import { ArbitrumPlutusJonesContractPositionFetcher } from './arbitrum/plutus.jones.contract-position-fetcher';
import { ArbitrumPlutusLockContractPositionFetcher } from './arbitrum/plutus.lock.contract-position-fetcher';
import { ArbitrumPlutusPlsDpxTokenFetcher } from './arbitrum/plutus.pls-dpx.token-fetcher';
import { ArbitrumPlutusPlsJonesTokenFetcher } from './arbitrum/plutus.pls-jones.token-fetcher';
import { ArbitrumPlutusStakeContractPositionFetcher } from './arbitrum/plutus.stake.contract-position-fetcher';
import { PlutusContractFactory } from './contracts';
import { PlutusAppDefinition, PLUTUS_DEFINITION } from './plutus.definition';

@Register.AppModule({
  appId: PLUTUS_DEFINITION.id,
  providers: [
    ArbitrumPlutusBalanceFetcher,
    ArbitrumPlutusDpxContractPositionFetcher,
    ArbitrumPlutusJonesContractPositionFetcher,
    ArbitrumPlutusLockContractPositionFetcher,
    ArbitrumPlutusStakeContractPositionFetcher,
    ArbitrumPlutusPlsDpxTokenFetcher,
    ArbitrumPlutusPlsJonesTokenFetcher,
    PlutusAppDefinition,
    PlutusContractFactory,
  ],
})
export class PlutusAppModule extends AbstractApp() {}
