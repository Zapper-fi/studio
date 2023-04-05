import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPlutusFarmPlsArbContractPositionFetcher } from './arbitrum/plutus.farm-pls-arb.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsDpxV2ContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx-v2.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsDpxContractPositionFetcher } from './arbitrum/plutus.farm-pls-dpx.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsJonesContractPositionFetcher } from './arbitrum/plutus.farm-pls-jones.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsLpContractPositionFetcher } from './arbitrum/plutus.farm-pls-lp.contract-position-fetcher';
import { ArbitrumPlutusFarmPlsRdntContractPositionFetcher } from './arbitrum/plutus.farm-pls-rdnt.contract-position-fetcher';
import { ArbitrumPlutusFarmContractPositionFetcher } from './arbitrum/plutus.farm.contract-position-fetcher';
import { ArbitrumPlutusLockContractPositionFetcher } from './arbitrum/plutus.lock.contract-position-fetcher';
import { ArbitrumPlutusPlvGlpTokenFetcher } from './arbitrum/plutus.plv-glp.token-fetcher';
import { ArbitrumPlutusTgeClaimableContractPositionFetcher } from './arbitrum/plutus.tge-claimable.contract-position-fetcher';
import { ArbitrumPlutusVaultTokenFetcher } from './arbitrum/plutus.vault.token-fetcher';
import { PlutusContractFactory } from './contracts';

@Module({
  providers: [
    PlutusContractFactory,
    ArbitrumPlutusFarmPlsArbContractPositionFetcher,
    ArbitrumPlutusFarmContractPositionFetcher,
    ArbitrumPlutusFarmPlsDpxContractPositionFetcher,
    ArbitrumPlutusFarmPlsDpxV2ContractPositionFetcher,
    ArbitrumPlutusFarmPlsJonesContractPositionFetcher,
    ArbitrumPlutusFarmPlsLpContractPositionFetcher,
    ArbitrumPlutusLockContractPositionFetcher,
    ArbitrumPlutusVaultTokenFetcher,
    ArbitrumPlutusPlvGlpTokenFetcher,
    ArbitrumPlutusTgeClaimableContractPositionFetcher,
    ArbitrumPlutusFarmPlsRdntContractPositionFetcher,
  ],
})
export class PlutusAppModule extends AbstractApp() {}
