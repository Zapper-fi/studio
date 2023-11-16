import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePenguinChefV1FarmContractPositionFetcher } from './avalanche/penguin.chef-v1-farm.contract-position-fetcher';
import { AvalanchePenguinChefV2FarmContractPositionFetcher } from './avalanche/penguin.chef-v2-farm.contract-position-fetcher';
import { AvalanchePenguinIPefiTokenFetcher } from './avalanche/penguin.i-pefi.token-fetcher';
import { AvalanchePenguinVaultClaimableContractPositionFetcher } from './avalanche/penguin.vault-claimable.contract-position-fetcher';
import { AvalanchePenguinVaultTokenFetcher } from './avalanche/penguin.vault.token-fetcher';
import { AvalanchePenguinXPefiTokenFetcher } from './avalanche/penguin.x-pefi.token-fetcher';
import { PenguinViemContractFactory } from './contracts';

@Module({
  providers: [
    PenguinViemContractFactory,
    AvalanchePenguinChefV1FarmContractPositionFetcher,
    AvalanchePenguinChefV2FarmContractPositionFetcher,
    AvalanchePenguinIPefiTokenFetcher,
    AvalanchePenguinXPefiTokenFetcher,
    AvalanchePenguinVaultTokenFetcher,
    AvalanchePenguinVaultClaimableContractPositionFetcher,
  ],
})
export class PenguinAppModule extends AbstractApp() {}
