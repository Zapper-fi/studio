import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { KlimaViemContractFactory } from './contracts';
import { PolygonKlimaBondContractPositionFetcher } from './polygon/klima.bond.contract-position-fetcher';
import { PolygonKlimaSKlimaTokenFetcher } from './polygon/klima.s-klima.token-fetcher';
import { PolygonKlimaWsKlimaTokenFetcher } from './polygon/klima.ws-klima.token-fetcher';

@Module({
  providers: [
    KlimaContractFactory,
    // Polygon
    PolygonKlimaBondContractPositionFetcher,
    PolygonKlimaSKlimaTokenFetcher,
    PolygonKlimaWsKlimaTokenFetcher,
  ],
})
export class KlimaAppModule extends AbstractApp() {}
