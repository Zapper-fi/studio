import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KlimaContractFactory } from './contracts';
import { KlimaAppDefinition, KLIMA_DEFINITION } from './klima.definition';
import { PolygonKlimaBondContractPositionFetcher } from './polygon/klima.bond.contract-position-fetcher';
import { PolygonKlimaSKlimaTokenFetcher } from './polygon/klima.s-klima.token-fetcher';
import { PolygonKlimaWsKlimaTokenFetcher } from './polygon/klima.ws-klima.token-fetcher';

@Register.AppModule({
  appId: KLIMA_DEFINITION.id,
  providers: [
    KlimaAppDefinition,
    KlimaContractFactory,
    // Polygon
    PolygonKlimaBondContractPositionFetcher,
    PolygonKlimaSKlimaTokenFetcher,
    PolygonKlimaWsKlimaTokenFetcher,
  ],
})
export class KlimaAppModule extends AbstractApp() {}
