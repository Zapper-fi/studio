import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossV2AppDefinition, ACROSS_V2_DEFINITION } from './across-v2.definition';
import { ArbitrumAcrossV2BalanceFetcher } from './arbitrum/across-v2.balance-fetcher';
import { ArbitrumAcrossV2PoolTokenFetcher } from './arbitrum/across-v2.pool.token-fetcher';
import { ArbitrumAcrossV2TvlFetcher } from './arbitrum/across-v2.tvl-fetcher';
import { BobaAcrossV2BalanceFetcher } from './boba/across-v2.balance-fetcher';
import { BobaAcrossV2PoolTokenFetcher } from './boba/across-v2.pool.token-fetcher';
import { BobaAcrossV2TvlFetcher } from './boba/across-v2.tvl-fetcher';
import { AcrossV2ContractFactory } from './contracts';
import { EthereumAcrossV2BalanceFetcher } from './ethereum/across-v2.balance-fetcher';
import { EthereumAcrossV2PoolTokenFetcher } from './ethereum/across-v2.pool.token-fetcher';
import { EthereumAcrossV2TvlFetcher } from './ethereum/across-v2.tvl-fetcher';
import { OptimismAcrossV2BalanceFetcher } from './optimism/across-v2.balance-fetcher';
import { OptimismAcrossV2PoolTokenFetcher } from './optimism/across-v2.pool.token-fetcher';
import { OptimismAcrossV2TvlFetcher } from './optimism/across-v2.tvl-fetcher';
import { PolygonAcrossV2BalanceFetcher } from './polygon/across-v2.balance-fetcher';
import { PolygonAcrossV2PoolTokenFetcher } from './polygon/across-v2.pool.token-fetcher';
import { PolygonAcrossV2TvlFetcher } from './polygon/across-v2.tvl-fetcher';

@Register.AppModule({
  appId: ACROSS_V2_DEFINITION.id,
  providers: [
    AcrossV2AppDefinition,
    AcrossV2ContractFactory,
    ArbitrumAcrossV2BalanceFetcher,
    ArbitrumAcrossV2PoolTokenFetcher,
    ArbitrumAcrossV2TvlFetcher,
    BobaAcrossV2BalanceFetcher,
    BobaAcrossV2PoolTokenFetcher,
    BobaAcrossV2TvlFetcher,
    EthereumAcrossV2BalanceFetcher,
    EthereumAcrossV2PoolTokenFetcher,
    EthereumAcrossV2TvlFetcher,
    OptimismAcrossV2BalanceFetcher,
    OptimismAcrossV2PoolTokenFetcher,
    OptimismAcrossV2TvlFetcher,
    PolygonAcrossV2BalanceFetcher,
    PolygonAcrossV2PoolTokenFetcher,
    PolygonAcrossV2TvlFetcher,
  ],
})
export class AcrossV2AppModule extends AbstractApp() {}
