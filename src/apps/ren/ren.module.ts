import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RenApiClient } from './common/ren.api.client';
import { RenViemContractFactory } from './contracts';
import { EthereumRenDarknodeContractPositionFetcher } from './ethereum/ren.darknode.contract-position-fetcher';

@Module({
  providers: [RenViemContractFactory, RenApiClient, EthereumRenDarknodeContractPositionFetcher],
})
export class RenAppModule extends AbstractApp() {}
