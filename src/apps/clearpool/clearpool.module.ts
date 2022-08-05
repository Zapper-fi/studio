import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ClearpoolAppDefinition, CLEARPOOL_DEFINITION } from './clearpool.definition';
import { ClearpoolContractFactory } from './contracts';
import { EthereumClearpoolPoolTokenFetcher } from './ethereum/clearpool.pool.token-fetcher';
import { PolygonClearpoolPoolTokenFetcher } from './polygon/clearpool.pool.token-fetcher';

@Register.AppModule({
  appId: CLEARPOOL_DEFINITION.id,
  providers: [
    ClearpoolAppDefinition,
    ClearpoolContractFactory,
    EthereumClearpoolPoolTokenFetcher,
    PolygonClearpoolPoolTokenFetcher,
  ],
})
export class ClearpoolAppModule extends AbstractApp() {}
