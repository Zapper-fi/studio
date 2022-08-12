import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BalancerV2AppDefinition, BALANCER_V2_DEFINITION } from './balancer-v2.definition';
import { BalancerV2ContractFactory } from './contracts';
import { EthereumBalancerV2PoolTokenFetcher } from './ethereum/balancer-v2.pool.token-fetcher';
import { BalancerV2CacheManager } from './helpers/balancer-v2.cache-manager';
import { BalancerV2ClaimableContractPositionBalanceHelper } from './helpers/balancer-v2.claimable.contract-position-balance-helper';
import { BalancerV2EventsPoolTokenDataStrategy } from './helpers/balancer-v2.events.pool-token-address-strategy';
import { BalancerV2PoolTokensHelper } from './helpers/balancer-v2.pool.token-helper';
import { BalancerV2GaugeRewardTokenStrategy } from './helpers/balancer-v2.reward-token-strategy';
import { BalancerV2SpotPriceHelper } from './helpers/balancer-v2.spot-price.helper';
import { BalancerV2TheGraphPoolTokenDataStrategy } from './helpers/balancer-v2.the-graph.pool-token-address-strategy';

@Register.AppModule({
  appId: BALANCER_V2_DEFINITION.id,
  providers: [
    BalancerV2AppDefinition,
    BalancerV2ContractFactory,
    // Arbitrum
    // ArbitrumBalancerV2PoolTokenFetcher,
    // ArbitrumBalancerV2StakedContractPositionFetcher,
    // Ethereum
    // EthereumBalancerV2BalanceFetcher,
    EthereumBalancerV2PoolTokenFetcher,
    // EthereumBalancerV2VotingEscrowContractPositionFetcher,
    // EthereumBalancerV2StakedContractPositionFetcher,
    // EthereumBalancerV2WrappedAaveTokenFetcher,
    // Polygon
    // PolygonBalancerV2PoolTokenFetcher,
    // PolygonBalancerV2StakedContractPositionFetcher,
    // Helpers
    BalancerV2CacheManager,
    BalancerV2PoolTokensHelper,
    BalancerV2SpotPriceHelper,
    BalancerV2TheGraphPoolTokenDataStrategy,
    BalancerV2ClaimableContractPositionBalanceHelper,
    BalancerV2EventsPoolTokenDataStrategy,
    BalancerV2GaugeRewardTokenStrategy,
  ],
  exports: [
    BalancerV2SpotPriceHelper,
    BalancerV2PoolTokensHelper,
    BalancerV2ContractFactory,
    BalancerV2GaugeRewardTokenStrategy,
  ],
})
export class BalancerV2AppModule extends AbstractApp() {}
