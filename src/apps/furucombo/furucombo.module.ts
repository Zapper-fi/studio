import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { FurucomboViemContractFactory } from './contracts';
import { PolygonFurucomboFundTokenFetcher } from './polygon/furucombo.fund.token-fetcher';

@Module({
  providers: [FurucomboViemContractFactory, PolygonFurucomboFundTokenFetcher],
})
export class FurucomboAppModule extends AbstractApp() {}
