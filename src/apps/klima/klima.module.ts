import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { KlimaViemContractFactory } from './contracts';
import { PolygonKlimaBondContractPositionFetcher } from './polygon/klima.bond.contract-position-fetcher';

@Module({
  providers: [
    KlimaViemContractFactory,
    // Polygon
    PolygonKlimaBondContractPositionFetcher,
  ],
})
export class KlimaAppModule extends AbstractApp() {}
