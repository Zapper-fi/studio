import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumRocketPoolBalanceFetcher } from './arbitrum/rocket-pool.balance-fetcher';
import { ArbitrumRocketPoolRethTokenFetcher } from './arbitrum/rocket-pool.reth.token-fetcher';
import { RocketPoolContractFactory } from './contracts';
import { EthereumRocketPoolBalanceFetcher } from './ethereum/rocket-pool.balance-fetcher';
import { EthereumRocketPoolRethTokenFetcher } from './ethereum/rocket-pool.reth.token-fetcher';
import { EthereumRocketPoolRplTokenFetcher } from './ethereum/rocket-pool.rpl.token-fetcher';
import { RocketPoolRethBalanceHelper } from './helpers/rocket-pool.reth.balance-helper';
import { RocketPoolRethTokenHelper } from './helpers/rocket-pool.reth.token-helper';
import { OptimismRocketPoolBalanceFetcher } from './optimism/rocket-pool.balance-fetcher';
import { OptimismRocketPoolRethTokenFetcher } from './optimism/rocket-pool.reth.token-fetcher';
import { PolygonRocketPoolBalanceFetcher } from './polygon/rocket-pool.balance-fetcher';
import { PolygonRocketPoolRethTokenFetcher } from './polygon/rocket-pool.reth.token-fetcher';
import { RocketPoolAppDefinition, ROCKET_POOL_DEFINITION } from './rocket-pool.definition';

@Register.AppModule({
  appId: ROCKET_POOL_DEFINITION.id,
  providers: [
    ArbitrumRocketPoolBalanceFetcher,
    ArbitrumRocketPoolRethTokenFetcher,
    EthereumRocketPoolBalanceFetcher,
    EthereumRocketPoolRethTokenFetcher,
    EthereumRocketPoolRplTokenFetcher,
    OptimismRocketPoolBalanceFetcher,
    OptimismRocketPoolRethTokenFetcher,
    PolygonRocketPoolBalanceFetcher,
    PolygonRocketPoolRethTokenFetcher,
    RocketPoolAppDefinition,
    RocketPoolContractFactory,
    RocketPoolRethBalanceHelper,
    RocketPoolRethTokenHelper,
  ],
})
export class RocketPoolAppModule extends AbstractApp() {}
