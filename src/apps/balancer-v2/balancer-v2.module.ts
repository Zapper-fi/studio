import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBalancerV2ClaimableContractPositionFetcher } from './arbitrum/balancer-v2.claimable.contract-position-fetcher';
import { ArbitrumBalancerV2FarmContractPositionFetcher } from './arbitrum/balancer-v2.farm.contract-position-fetcher';
import { ArbitrumBalancerV2PoolTokenFetcher } from './arbitrum/balancer-v2.pool.token-fetcher';
import { BalancerV2AppDefinition, BALANCER_V2_DEFINITION } from './balancer-v2.definition';
import { BalancerV2ClaimableCacheManager } from './common/balancer-v2.claimable.cache-manager';
import { BalancerV2SpotPriceHelper } from './common/balancer-v2.spot-price.helper';
import { BalancerV2ContractFactory } from './contracts';
import { EthereumBalancerV2ClaimableContractPositionFetcher } from './ethereum/balancer-v2.claimable.contract-position-fetcher';
import { EthereumBalancerV2FarmContractPositionFetcher } from './ethereum/balancer-v2.farm.contract-position-fetcher';
import { EthereumBalancerV2PoolTokenFetcher } from './ethereum/balancer-v2.pool.token-fetcher';
import { EthereumBalancerV2VotingEscrowContractPositionFetcher } from './ethereum/balancer-v2.voting-escrow.contract-position-fetcher';
import { EthereumBalancerV2WrappedAaveTokenFetcher } from './ethereum/balancer-v2.wrapped-aave.token-fetcher';
import { PolygonBalancerV2ClaimableContractPositionFetcher } from './polygon/balancer-v2.claimable.contract-position-fetcher';
import { PolygonBalancerV2FarmContractPositionFetcher } from './polygon/balancer-v2.farm.contract-position-fetcher';
import { PolygonBalancerV2PoolTokenFetcher } from './polygon/balancer-v2.pool.token-fetcher';

@Register.AppModule({
  appId: BALANCER_V2_DEFINITION.id,
  providers: [
    BalancerV2AppDefinition,
    BalancerV2ContractFactory,
    // Arbitrum
    ArbitrumBalancerV2PoolTokenFetcher,
    ArbitrumBalancerV2FarmContractPositionFetcher,
    ArbitrumBalancerV2ClaimableContractPositionFetcher,
    // Ethereum
    EthereumBalancerV2ClaimableContractPositionFetcher,
    EthereumBalancerV2PoolTokenFetcher,
    EthereumBalancerV2VotingEscrowContractPositionFetcher,
    EthereumBalancerV2FarmContractPositionFetcher,
    EthereumBalancerV2WrappedAaveTokenFetcher,
    // Polygon
    PolygonBalancerV2PoolTokenFetcher,
    PolygonBalancerV2FarmContractPositionFetcher,
    PolygonBalancerV2ClaimableContractPositionFetcher,
    // Helpers
    BalancerV2ClaimableCacheManager,
    BalancerV2SpotPriceHelper,
  ],
  exports: [BalancerV2SpotPriceHelper, BalancerV2ContractFactory],
})
export class BalancerV2AppModule extends AbstractApp() {}
