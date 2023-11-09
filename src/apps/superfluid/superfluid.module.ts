import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SuperfluidViemContractFactory } from './contracts';
import { PolygonSuperfluidVaultTokenFetcher } from './polygon/superfluid.vault.token-fetcher';

@Module({
  providers: [SuperfluidViemContractFactory, PolygonSuperfluidVaultTokenFetcher],
})
export class SuperfluidAppModule extends AbstractApp() {}
