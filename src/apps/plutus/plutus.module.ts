import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPlutusBalanceFetcher } from './arbitrum/plutus.balance-fetcher';
import { ArbitrumPlutusLockContractPositionFetcher } from './arbitrum/plutus.lock.contract-position-fetcher';
import { ArbitrumPlutusPlsDpxFarmV2ContractPositionFetcher } from './arbitrum/plutus.pls-dpx-farm-v2.contract-position-fetcher';
import { ArbitrumPlutusPlsDpxFarmContractPositionFetcher } from './arbitrum/plutus.pls-dpx-farm.contract-position-fetcher';
import { ArbitrumPlutusPlsDpxTokenFetcher } from './arbitrum/plutus.pls-dpx.token-fetcher';
import { ArbitrumPlutusPlsFarmContractPositionFetcher } from './arbitrum/plutus.pls-farm.contract-position-fetcher';
import { ArbitrumPlutusPlsJonesFarmContractPositionFetcher } from './arbitrum/plutus.pls-jones-farm.contract-position-fetcher';
import { ArbitrumPlutusPlsJonesTokenFetcher } from './arbitrum/plutus.pls-jones.token-fetcher';
import { PlutusContractFactory } from './contracts';
import { PlutusAppDefinition, PLUTUS_DEFINITION } from './plutus.definition';

@Register.AppModule({
  appId: PLUTUS_DEFINITION.id,
  providers: [
    ArbitrumPlutusBalanceFetcher,
    ArbitrumPlutusPlsDpxFarmContractPositionFetcher,
    ArbitrumPlutusPlsDpxFarmV2ContractPositionFetcher,
    ArbitrumPlutusPlsJonesFarmContractPositionFetcher,
    ArbitrumPlutusLockContractPositionFetcher,
    ArbitrumPlutusPlsFarmContractPositionFetcher,
    ArbitrumPlutusPlsDpxTokenFetcher,
    ArbitrumPlutusPlsJonesTokenFetcher,
    PlutusAppDefinition,
    PlutusContractFactory,
  ],
})
export class PlutusAppModule extends AbstractApp() {}
