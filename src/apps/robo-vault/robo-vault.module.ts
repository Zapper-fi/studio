import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheRoboVaultVaultTokenFetcher } from './avalanche/robo-vault.vault.token-fetcher';
import { RoboVaultApiClient } from './common/robo-vault.api.client';
import { RoboVaultContractFactory } from './contracts';
import { FantomRoboVaultVaultTokenFetcher } from './fantom/robo-vault.vault.token-fetcher';

@Module({
  providers: [
    RoboVaultContractFactory,
    RoboVaultApiClient,
    AvalancheRoboVaultVaultTokenFetcher,
    FantomRoboVaultVaultTokenFetcher,
  ],
})
export class RoboVaultAppModule extends AbstractApp() {}
