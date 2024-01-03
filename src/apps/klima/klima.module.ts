import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { KlimaViemContractFactory } from './contracts';
import { PolygonKlimaBondContractPositionFetcher } from './polygon/klima.bond.contract-position-fetcher';
import { PolygonKlimaSKlimaTokenFetcher } from './polygon/klima.s-klima.token-fetcher';

@Module({
  providers: [
    KlimaViemContractFactory,
    // Polygon
    PolygonKlimaBondContractPositionFetcher,
    PolygonKlimaSKlimaTokenFetcher,
  ],
})
export class KlimaAppModule extends AbstractApp() {}
