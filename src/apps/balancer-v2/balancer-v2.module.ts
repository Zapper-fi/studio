import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BalancerV2AppDefinition, BALANCER_V2_DEFINITION } from './balancer-v2.definition';
import { BalancerV2ContractFactory } from './contracts';
import { EthereumBalancerV2PoolTokenFetcher } from './ethereum/balancer-v2.pool.token-fetcher';
import { BalancerV2CacheManager } from './helpers/balancer-v2.cache-manager';
import { BalancerV2ClaimableContractPositionBalanceHelper } from './helpers/balancer-v2.claimable.contract-position-balance-helper';
import { BalancerV2SpotPriceHelper } from './helpers/balancer-v2.spot-price.helper';

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
    BalancerV2SpotPriceHelper,
    BalancerV2ClaimableContractPositionBalanceHelper,
  ],
  exports: [BalancerV2SpotPriceHelper, BalancerV2ContractFactory],
})
export class BalancerV2AppModule extends AbstractApp() {}
