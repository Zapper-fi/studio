import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPlutusFarmPlsDpxLpContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx-lp.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsDpxV2ContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx-v2.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsDpxContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsJonesLpContractPositionFetcher } from './arbitrum/plutus.farm-pls-jones-lp.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsJonesContractPositionFetcher } from './arbitrum/plutus.farm-pls-jones.contract-position-fetcher';
import { ArbitrumPlutusFarmPlvGlpContractPositionFetcher } from './arbitrum/plutus.farm-plv-glp.contract-position-fetcher';
import { ArbitrumPlutusFarmContractPositionFetcher } from './arbitrum/plutus.farm.contract-position-fetcher';
import { ArbitrumPlutusLockContractPositionFetcher } from './arbitrum/plutus.lock.contract-position-fetcher';
import { ArbitrumPlutusPlsDpxTokenFetcher } from './arbitrum/plutus.pls-dpx.token-fetcher';
import { ArbitrumPlutusPlsGlpTokenFetcher } from './arbitrum/plutus.pls-glp.token-fetcher';
import { ArbitrumPlutusPlsJonesTokenFetcher } from './arbitrum/plutus.pls-jones.token-fetcher';
import { ArbitrumPlutusPlvGlpTokenFetcher } from './arbitrum/plutus.plv-glp.token-fetcher';
import { ArbitrumPlutusTgeClaimableContractPositionFetcher } from './arbitrum/plutus.tge-claimable.contract-position-fetcher';
import { PlutusContractFactory } from './contracts';

@Module({
  providers: [
    PlutusContractFactory,
    ArbitrumPlutusFarmPlsDpxLpContractPositionFetcher,
    ArbitrumPlutusFarmPlsDpxV2ContractPositionFetcher,
    ArbitrumPlutusFarmPlsDpxContractPositionFetcher,
    ArbitrumPlutusFarmPlsJonesLpContractPositionFetcher,
    ArbitrumPlutusFarmPlsJonesContractPositionFetcher,
    ArbitrumPlutusFarmContractPositionFetcher,
    ArbitrumPlutusFarmPlvGlpContractPositionFetcher,
    ArbitrumPlutusLockContractPositionFetcher,
    ArbitrumPlutusPlsDpxTokenFetcher,
    ArbitrumPlutusPlsJonesTokenFetcher,
    ArbitrumPlutusPlsGlpTokenFetcher,
    ArbitrumPlutusPlvGlpTokenFetcher,
    ArbitrumPlutusTgeClaimableContractPositionFetcher,
  ],
})
export class PlutusAppModule extends AbstractApp() {}
