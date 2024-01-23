import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePenguinChefV1FarmContractPositionFetcher } from './avalanche/penguin.chef-v1-farm.contract-position-fetcher';
import { AvalanchePenguinChefV2FarmContractPositionFetcher } from './avalanche/penguin.chef-v2-farm.contract-position-fetcher';
import { AvalanchePenguinVaultClaimableContractPositionFetcher } from './avalanche/penguin.vault-claimable.contract-position-fetcher';
import { PenguinViemContractFactory } from './contracts';

@Module({
  providers: [
    PenguinViemContractFactory,
    AvalanchePenguinChefV1FarmContractPositionFetcher,
    AvalanchePenguinChefV2FarmContractPositionFetcher,
    AvalanchePenguinVaultClaimableContractPositionFetcher,
  ],
})
export class PenguinAppModule extends AbstractApp() {}
