import { Module } from '@nestjs/common';

import { AbstractApp, ExternalAppImport } from '~app/app.dynamic-module';
import { CurveAppModule } from '~apps/curve';

import { ArbitrumBalancerV2BalanceFetcher } from './arbitrum/balancer-v2.balance-fetcher';
import { ArbitrumBalancerV2PoolTokenFetcher } from './arbitrum/balancer-v2.pool.token-fetcher';
import { BalancerV2AppDefinition } from './balancer-v2.definition';
import { BalancerV2ContractFactory } from './contracts';
import { EthereumBalancerV2BalanceFetcher } from './ethereum/balancer-v2.balance-fetcher';
import { EthereumBalancerV2PoolTokenFetcher } from './ethereum/balancer-v2.pool.token-fetcher';
import { EthereumBalancerV2StakedfContractPositionFetcher } from './ethereum/balancer-v2.staked.contract-position-fetcher';
import { EthereumBalancerV2VotingEscrowContractPositionFetcher } from './ethereum/balancer-v2.voting-escrow.contract-position-fetcher';
import { BalancerV2CacheManager } from './helpers/balancer-v2.cache-manager';
import { BalancerV2ClaimableContractPositionBalanceHelper } from './helpers/balancer-v2.claimable.contract-position-balance-helper';
import { BalancerV2EventsPoolTokenDataStrategy } from './helpers/balancer-v2.events.pool-token-address-strategy';
import { BalancerV2GaugeAddressesGetter } from './helpers/balancer-v2.gauge-addresses-getter';
import { BalancerV2PoolTokensHelper } from './helpers/balancer-v2.pool.token-helper';
import { BalancerV2SpotPriceHelper } from './helpers/balancer-v2.spot-price.helper';
import { BalancerV2TheGraphPoolTokenDataStrategy } from './helpers/balancer-v2.the-graph.pool-token-address-strategy';
import { PolygonBalancerV2BalanceFetcher } from './polygon/balancer-v2.balance-fetcher';
import { PolygonBalancerV2PoolTokenFetcher } from './polygon/balancer-v2.pool.token-fetcher';

@Module({
  imports: ExternalAppImport(CurveAppModule),
  providers: [
    BalancerV2AppDefinition,
    BalancerV2ContractFactory,
    // Arbitrum
    ArbitrumBalancerV2BalanceFetcher,
    ArbitrumBalancerV2PoolTokenFetcher,
    // Ethereum
    EthereumBalancerV2BalanceFetcher,
    EthereumBalancerV2PoolTokenFetcher,
    EthereumBalancerV2VotingEscrowContractPositionFetcher,
    EthereumBalancerV2StakedfContractPositionFetcher,
    // Polygon
    PolygonBalancerV2BalanceFetcher,
    PolygonBalancerV2PoolTokenFetcher,
    // Helpers
    BalancerV2CacheManager,
    BalancerV2PoolTokensHelper,
    BalancerV2SpotPriceHelper,
    BalancerV2TheGraphPoolTokenDataStrategy,
    BalancerV2ClaimableContractPositionBalanceHelper,
    BalancerV2EventsPoolTokenDataStrategy,
    BalancerV2GaugeAddressesGetter,
  ],
})
export class BalancerV2AppModule extends AbstractApp() {}
