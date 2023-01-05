import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArrakisAppDefinition, ARRAKIS_DEFINITION } from './arrakis.definition';
import { ArrakisPoolDefinitionsResolver } from './common/arrakis.pool-definition-resolver';
import { ArrakisContractFactory } from './contracts';
import { EthereumArrakisPoolTokenFetcher } from './ethereum/arrakis.pool.token-fetcher';
import { OptimismArrakisPoolTokenFetcher } from './optimism/arrakis.pool.token-fetcher';
import { PolygonArrakisPoolTokenFetcher } from './polygon/arrakis.pool.token-fetcher';

@Register.AppModule({
  appId: ARRAKIS_DEFINITION.id,
  providers: [
    ArrakisAppDefinition,
    ArrakisContractFactory,
    ArrakisPoolDefinitionsResolver,
    EthereumArrakisPoolTokenFetcher,
    OptimismArrakisPoolTokenFetcher,
    PolygonArrakisPoolTokenFetcher,
  ],
})
export class ArrakisAppModule extends AbstractApp() {}
