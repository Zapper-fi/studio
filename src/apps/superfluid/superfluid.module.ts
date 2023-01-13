import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SuperfluidContractFactory } from './contracts';
import { PolygonSuperfluidVaultTokenFetcher } from './polygon/superfluid.vault.token-fetcher';
import { SuperfluidAppDefinition } from './superfluid.definition';

@Module({
  providers: [SuperfluidContractFactory, PolygonSuperfluidVaultTokenFetcher],
})
export class SuperfluidAppModule extends AbstractApp() {}
