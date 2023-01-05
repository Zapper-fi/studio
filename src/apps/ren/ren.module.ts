import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RenApiClient } from './common/ren.api.client';
import { RenContractFactory } from './contracts';
import { EthereumRenDarknodeContractPositionFetcher } from './ethereum/ren.darknode.contract-position-fetcher';
import { RenModuleAppDefinition } from './ren.definition';

@Module({
  providers: [RenModuleAppDefinition, RenContractFactory, RenApiClient, EthereumRenDarknodeContractPositionFetcher],
})
export class RenAppModule extends AbstractApp() {}
