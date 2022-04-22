import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { ArbitrumCurveBalanceFetcher } from './arbitrum/curve.balance-fetcher';
import { ArbitrumCurveFarmContractPositionFetcher } from './arbitrum/curve.farm.contract-position-fetcher';
import { ArbitrumCurvePoolTokenFetcher } from './arbitrum/curve.pool.token-fetcher';
import { AvalancheCurveBalanceFetcher } from './avalanche/curve.balance-fetcher';
import { AvalancheCurveFarmContractPositionFetcher } from './avalanche/curve.farm.contract-position-fetcher';
import { AvalancheCurvePoolTokenFetcher } from './avalanche/curve.pool.token-fetcher';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition } from './curve.definition';
import { EthereumCurveBalanceFetcher } from './ethereum/curve.balance-fetcher';
import { EthereumCurveFarmContractPositionFetcher } from './ethereum/curve.farm.contract-position-fetcher';
import { EthereumCurvePoolTokenFetcher } from './ethereum/curve.pool.token-fetcher';
import { EthereumCurveVestingEscrowContractPositionFetcher } from './ethereum/curve.vesting-escrow.contract-position-fetcher';
import { EthereumCurveVotingEscrowContractPositionFetcher } from './ethereum/curve.voting-escrow.contract-position-fetcher';
import { FantomCurveBalanceFetcher } from './fantom/curve.balance-fetcher';
import { FantomCurveFarmContractPositionFetcher } from './fantom/curve.farm.contract-position-fetcher';
import { FantomCurvePoolTokenFetcher } from './fantom/curve.pool.token-fetcher';
import { GnosisCurveBalanceFetcher } from './gnosis/curve.balance-fetcher';
import { GnosisCurveFarmContractPositionFetcher } from './gnosis/curve.farm.contract-position-fetcher';
import { GnosisCurvePoolTokenFetcher } from './gnosis/curve.pool.token-fetcher';
import { HarmonyCurveBalanceFetcher } from './harmony/curve.balance-fetcher';
import { HarmonyCurveFarmContractPositionFetcher } from './harmony/curve.farm.contract-position-fetcher';
import { HarmonyCurvePoolTokenFetcher } from './harmony/curve.pool.token-fetcher';
import { CurveApiVolumeStrategy } from './helpers/curve.api.volume-strategy';
import { CurveCryptoFactoryPoolTokenHelper } from './helpers/curve.crypto-factory-pool.token-helper';
import { CurveCryptoFactoryPoolDefinitionStrategy } from './helpers/curve.crypto-factory.pool-definition-strategy';
import { CurveFactoryGaugeAddressHelper } from './helpers/curve.factory-gauge.address-helper';
import { CurveFactoryPoolTokenHelper } from './helpers/curve.factory-pool.token-helper';
import { CurveFactoryPoolDefinitionStrategy } from './helpers/curve.factory.pool-definition-strategy';
import { CurveGaugeV2RewardTokenStrategy } from './helpers/curve.gauge-v2.reward-token-strategy';
import { CurveGaugeV2RoiStrategy } from './helpers/curve.gauge-v2.roi-strategy';
import { CurveGaugeIsActiveStrategy } from './helpers/curve.gauge.is-active-strategy';
import { CurveGaugeRoiStrategy } from './helpers/curve.gauge.roi-strategy';
import { CurveLiquidityPriceStrategy } from './helpers/curve.liquidity.price-strategy';
import { CurveOnChainCoinStrategy } from './helpers/curve.on-chain.coin-strategy';
import { CurveOnChainReserveStrategy } from './helpers/curve.on-chain.reserve-strategy';
import { CurveOnChainVolumeStrategy } from './helpers/curve.on-chain.volume-strategy';
import { CurvePoolTokenHelper } from './helpers/curve.pool.token-helper';
import { CurveV1PoolTokenHelper } from './helpers/curve.v1-pool.token-helper';
import { CurveV2PoolTokenHelper } from './helpers/curve.v2-pool.token-helper';
import { CurveVestingEscrowContractPositionBalanceHelper } from './helpers/curve.vesting-escrow.contract-position-balance-helper';
import { CurveVestingEscrowContractPositionHelper } from './helpers/curve.vesting-escrow.contract-position-helper';
import { CurveVirtualPriceStrategy } from './helpers/curve.virtual.price-strategy';
import { CurveVotingEscrowContractPositionBalanceHelper } from './helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from './helpers/curve.voting-escrow.contract-position-helper';
import { OptimismCurveBalanceFetcher } from './optimism/curve.balance-fetcher';
import { OptimismCurveFarmContractPositionFetcher } from './optimism/curve.farm.contract-position-fetcher';
import { OptimismCurvePoolTokenFetcher } from './optimism/curve.pool.token-fetcher';
import { PolygonCurveBalanceFetcher } from './polygon/curve.balance-fetcher';
import { PolygonCurveFarmContractPositionFetcher } from './polygon/curve.farm.contract-position-fetcher';
import { PolygonCurvePoolTokenFetcher } from './polygon/curve.pool.token-fetcher';

@Module({
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    // Arbitrum
    ArbitrumCurveBalanceFetcher,
    ArbitrumCurvePoolTokenFetcher,
    ArbitrumCurveFarmContractPositionFetcher,
    // Avalanche
    AvalancheCurveBalanceFetcher,
    AvalancheCurvePoolTokenFetcher,
    AvalancheCurveFarmContractPositionFetcher,
    // Ethereum
    EthereumCurveBalanceFetcher,
    EthereumCurvePoolTokenFetcher,
    EthereumCurveFarmContractPositionFetcher,
    EthereumCurveVotingEscrowContractPositionFetcher,
    EthereumCurveVestingEscrowContractPositionFetcher,
    // Fantom
    FantomCurveBalanceFetcher,
    FantomCurvePoolTokenFetcher,
    FantomCurveFarmContractPositionFetcher,
    // Gnosis
    GnosisCurveBalanceFetcher,
    GnosisCurvePoolTokenFetcher,
    GnosisCurveFarmContractPositionFetcher,
    // Harmony
    HarmonyCurveBalanceFetcher,
    HarmonyCurvePoolTokenFetcher,
    HarmonyCurveFarmContractPositionFetcher,
    // Optimism
    OptimismCurveBalanceFetcher,
    OptimismCurvePoolTokenFetcher,
    OptimismCurveFarmContractPositionFetcher,
    // Polygon
    PolygonCurveBalanceFetcher,
    PolygonCurvePoolTokenFetcher,
    PolygonCurveFarmContractPositionFetcher,
    // Token Helpers
    CurvePoolTokenHelper,
    CurveV1PoolTokenHelper,
    CurveV2PoolTokenHelper,
    CurveFactoryPoolTokenHelper,
    CurveCryptoFactoryPoolTokenHelper,
    // Token Helper Strategies
    CurveApiVolumeStrategy,
    CurveOnChainVolumeStrategy,
    CurveOnChainCoinStrategy,
    CurveOnChainReserveStrategy,
    CurveVirtualPriceStrategy,
    CurveLiquidityPriceStrategy,
    CurveFactoryPoolDefinitionStrategy,
    CurveCryptoFactoryPoolDefinitionStrategy,
    // Gauge Helper Strategies
    CurveGaugeIsActiveStrategy,
    CurveGaugeRoiStrategy,
    CurveGaugeV2RoiStrategy,
    CurveGaugeV2RewardTokenStrategy,
    CurveFactoryGaugeAddressHelper,
    // Voting Escrow Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVestingEscrowContractPositionHelper,
    CurveVestingEscrowContractPositionBalanceHelper,
  ],
  exports: [
    CurveContractFactory,
    // Token Helpers
    CurvePoolTokenHelper,
    CurveV1PoolTokenHelper,
    CurveV2PoolTokenHelper,
    CurveFactoryPoolTokenHelper,
    CurveCryptoFactoryPoolTokenHelper,
    // Token Helper Strategies
    CurveApiVolumeStrategy,
    CurveOnChainVolumeStrategy,
    CurveOnChainCoinStrategy,
    CurveOnChainReserveStrategy,
    CurveVirtualPriceStrategy,
    CurveLiquidityPriceStrategy,
    CurveFactoryPoolDefinitionStrategy,
    CurveCryptoFactoryPoolDefinitionStrategy,
    // Gauge Helper Strategies
    CurveGaugeIsActiveStrategy,
    CurveGaugeRoiStrategy,
    CurveGaugeV2RoiStrategy,
    CurveGaugeV2RewardTokenStrategy,
    CurveFactoryGaugeAddressHelper,
    // Voting Escrow Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVestingEscrowContractPositionHelper,
    CurveVestingEscrowContractPositionBalanceHelper,
  ],
})
export class CurveAppModule extends AbstractDynamicApp<CurveAppModule>() {}
