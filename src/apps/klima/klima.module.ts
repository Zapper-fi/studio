import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KlimaContractFactory } from './contracts';
import { KlimaAppDefinition, KLIMA_DEFINITION } from './klima.definition';
import { PolygonKlimaBondContractPositionFetcher } from './polygon/klima.bond.contract-position-fetcher';
import { PolygonKlimaSTokenFetcher } from './polygon/klima.s-klima.token-fetcher';
import { PolygonKlimaWsTokenFetcher } from './polygon/klima.ws-klima.token-fetcher';

@Register.AppModule({
  appId: KLIMA_DEFINITION.id,
  providers: [
    KlimaAppDefinition,
    KlimaContractFactory,
    // Polygon
    PolygonKlimaBondContractPositionFetcher,
    PolygonKlimaSTokenFetcher,
    PolygonKlimaWsTokenFetcher,
  ],
})
export class KlimaAppModule extends AbstractApp() {}
