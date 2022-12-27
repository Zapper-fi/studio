import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { HoneyswapContractFactory } from './contracts';
import { GnosisHoneyswapPoolTokenFetcher } from './gnosis/honeyswap.pool.token-fetcher';
import { HoneyswapAppDefinition, HONEYSWAP_DEFINITION } from './honeyswap.definition';
import { PolygonHoneyswapPoolTokenFetcher } from './polygon/honeyswap.pool.token-fetcher';

@Register.AppModule({
  appId: HONEYSWAP_DEFINITION.id,
  providers: [
    HoneyswapAppDefinition,
    HoneyswapContractFactory,
    // Gnosis
    GnosisHoneyswapPoolTokenFetcher,
    // Polygon
    PolygonHoneyswapPoolTokenFetcher,
  ],
})
export class HoneyswapAppModule extends AbstractApp() {}
