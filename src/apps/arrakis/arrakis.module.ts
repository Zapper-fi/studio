import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { ArrakisAppDefinition, ARRAKIS_DEFINITION } from './arrakis.definition';
import { ArrakisContractFactory } from './contracts';
import { EthereumArrakisBalanceFetcher } from './ethereum/arrakis.balance-fetcher';
import { EthereumArrakisPoolTokenFetcher } from './ethereum/arrakis.pool.token-fetcher';
import { ArrakisPoolTokenHelper } from './helpers/arrakis.pool.token-helper';
import { OptimismArrakisBalanceFetcher } from './optimism/arrakis.balance-fetcher';
import { OptimismArrakisPoolTokenFetcher } from './optimism/arrakis.pool.token-fetcher';
import { PolygonArrakisBalanceFetcher } from './polygon/arrakis.balance-fetcher';
import { PolygonArrakisPoolTokenFetcher } from './polygon/arrakis.pool.token-fetcher';

@Register.AppModule({
  appId: ARRAKIS_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    ArrakisAppDefinition,
    ArrakisContractFactory,
    ArrakisPoolTokenHelper,
    // Ethereum
    EthereumArrakisPoolTokenFetcher,
    EthereumArrakisBalanceFetcher,
    // Optimism
    OptimismArrakisPoolTokenFetcher,
    OptimismArrakisBalanceFetcher,
    // Polygon
    PolygonArrakisPoolTokenFetcher,
    PolygonArrakisBalanceFetcher,
  ],
})
export class ArrakisAppModule extends AbstractApp() {}
