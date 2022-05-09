import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { KlimaAppDefinition, KLIMA_DEFINITION } from './klima.definition';
import { PolygonKlimaBalanceFetcher } from './polygon/klima.balance-fetcher';
import { PolygonKlimaBondContractPositionFetcher } from './polygon/klima.bond.contract-position';
import { PolygonKlimaSTokenFetcher } from './polygon/klima.s-klima.token-fetcher';
import { PolygonKlimaWsTokenFetcher } from './polygon/klima.ws-klima.token-fetcher';

@Register.AppModule({
  appId: KLIMA_DEFINITION.id,
  imports: [OlympusAppModule],
  providers: [
    KlimaAppDefinition,
    // Polygon
    PolygonKlimaBalanceFetcher,
    PolygonKlimaBondContractPositionFetcher,
    PolygonKlimaSTokenFetcher,
    PolygonKlimaWsTokenFetcher,
  ],
})
export class KlimaAppModule extends AbstractApp() {}
