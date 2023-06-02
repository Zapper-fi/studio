import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { TaiContractFactory } from './contracts';
import { TaiCollateralResolver } from './ethereum/tai.collateral-fetcher';
import { TaiSafeContractPositionFetcher } from './ethereum/tai.safe.contract-position-fetcher';

@Module({
  providers: [TaiContractFactory, TaiCollateralResolver, TaiSafeContractPositionFetcher],
})
export class TaiAppModule extends AbstractApp() {}
