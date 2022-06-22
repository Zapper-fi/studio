import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossV2AppDefinition, ACROSS_V2_DEFINITION } from './across-v2.definition';
import { ArbitrumAcrossV2BalanceFetcher } from './arbitrum/across-v2.balance-fetcher';
import { ArbitrumAcrossV2PoolTokenFetcher } from './arbitrum/across-v2.pool.token-fetcher';
import { AcrossV2ContractFactory } from './contracts';
import { EthereumAcrossV2BalanceFetcher } from './ethereum/across-v2.balance-fetcher';
import { EthereumAcrossV2PoolTokenFetcher } from './ethereum/across-v2.pool.token-fetcher';
import { OptimismAcrossV2BalanceFetcher } from './optimism/across-v2.balance-fetcher';
import { OptimismAcrossV2PoolTokenFetcher } from './optimism/across-v2.pool.token-fetcher';
import { PolygonAcrossV2BalanceFetcher } from './polygon/across-v2.balance-fetcher';
import { PolygonAcrossV2PoolTokenFetcher } from './polygon/across-v2.pool.token-fetcher';

@Register.AppModule({
  appId: ACROSS_V2_DEFINITION.id,
  providers: [
    AcrossV2AppDefinition,
    AcrossV2ContractFactory,
    ArbitrumAcrossV2BalanceFetcher,
    ArbitrumAcrossV2PoolTokenFetcher,
    EthereumAcrossV2BalanceFetcher,
    EthereumAcrossV2PoolTokenFetcher,
    OptimismAcrossV2BalanceFetcher,
    OptimismAcrossV2PoolTokenFetcher,
    PolygonAcrossV2BalanceFetcher,
    PolygonAcrossV2PoolTokenFetcher,
  ],
})
export class AcrossV2AppModule extends AbstractApp() {}
