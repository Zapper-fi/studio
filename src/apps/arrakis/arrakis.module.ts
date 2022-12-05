import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { ArrakisAppDefinition, ARRAKIS_DEFINITION } from './arrakis.definition';
import { ArrakisPoolDefinitionsResolver } from './common/arrakis.pool-definition-resolver';
import { ArrakisContractFactory } from './contracts';
import { EthereumArrakisPoolTokenFetcher } from './ethereum/arrakis.pool.token-fetcher';
import { OptimismArrakisPoolTokenFetcher } from './optimism/arrakis.pool.token-fetcher';
import { PolygonArrakisPoolTokenFetcher } from './polygon/arrakis.pool.token-fetcher';

@Register.AppModule({
  appId: ARRAKIS_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    ArrakisAppDefinition,
    ArrakisContractFactory,
    ArrakisPoolDefinitionsResolver,
    // Ethereum
    EthereumArrakisPoolTokenFetcher,
    // Optimism
    OptimismArrakisPoolTokenFetcher,
    // Polygon
    PolygonArrakisPoolTokenFetcher,
  ],
})
export class ArrakisAppModule extends AbstractApp() {}
