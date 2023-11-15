import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { TaiViemContractFactory } from './contracts';
import { TaiCollateralResolver } from './ethereum/tai.collateral-fetcher';
import { TaiSafeContractPositionFetcher } from './ethereum/tai.safe.contract-position-fetcher';

@Module({
  providers: [TaiViemContractFactory, TaiCollateralResolver, TaiSafeContractPositionFetcher],
})
export class TaiAppModule extends AbstractApp() {}
