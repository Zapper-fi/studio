import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPlutusBalanceFetcher } from './arbitrum/plutus.balance-fetcher';
import { ArbitrumPlutusLockContractPositionFetcher } from './arbitrum/plutus.lock.contract-position-fetcher';
import { ArbitrumPlutusPoolsContractPositionFetcher } from './arbitrum/plutus.pools.contract-position-fetcher';
import { ArbitrumPlutusVeTokenFetcher } from './arbitrum/plutus.ve.token-fetcher';
import { PlutusContractFactory } from './contracts';
import { PlutusAppDefinition, PLUTUS_DEFINITION } from './plutus.definition';

@Register.AppModule({
  appId: PLUTUS_DEFINITION.id,
  providers: [
    ArbitrumPlutusBalanceFetcher,
    ArbitrumPlutusLockContractPositionFetcher,
    ArbitrumPlutusPoolsContractPositionFetcher,
    ArbitrumPlutusVeTokenFetcher,
    PlutusAppDefinition,
    PlutusContractFactory,
  ],
})
export class PlutusAppModule extends AbstractApp() { }
