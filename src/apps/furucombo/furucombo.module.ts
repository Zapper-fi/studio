import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { FurucomboContractFactory } from './contracts';
import { FurucomboAppDefinition } from './furucombo.definition';
import { PolygonFurucomboFundTokenFetcher } from './polygon/furucombo.fund.token-fetcher';

@Module({
  providers: [FurucomboAppDefinition, FurucomboContractFactory, PolygonFurucomboFundTokenFetcher],
})
export class FurucomboAppModule extends AbstractApp() {}
