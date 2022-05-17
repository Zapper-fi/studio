import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCurveBalanceFetcher } from './arbitrum/curve.balance-fetcher';
import { ArbitrumCurveFarmContractPositionFetcher } from './arbitrum/curve.farm.contract-position-fetcher';
import { ArbitrumCurvePoolTokenFetcher } from './arbitrum/curve.pool.token-fetcher';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { CurveApiVolumeStrategy } from './helpers/curve.api.volume-strategy';
import { CurveChildLiquidityGaugeFactoryAddressHelper } from './helpers/curve.child-liquidity-gauge-factory.address-helper';
import { CurveChildLiquidityGaugeRewardTokenStrategy } from './helpers/curve.child-liquidity-gauge.reward-token-strategy';
import { CurveChildLiquidityGaugeRoiStrategy } from './helpers/curve.child-liquidity-gauge.roi-strategy';
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

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    // Arbitrum
    ArbitrumCurveBalanceFetcher,
    ArbitrumCurvePoolTokenFetcher,
    ArbitrumCurveFarmContractPositionFetcher,
    // // Avalanche
    // AvalancheCurveBalanceFetcher,
    // AvalancheCurvePoolTokenFetcher,
    // AvalancheCurveFarmContractPositionFetcher,
    // // Ethereum
    // EthereumCurveBalanceFetcher,
    // EthereumCurvePoolTokenFetcher,
    // EthereumCurveFarmContractPositionFetcher,
    // EthereumCurveVotingEscrowContractPositionFetcher,
    // EthereumCurveVestingEscrowContractPositionFetcher,
    // // Fantom
    // FantomCurveBalanceFetcher,
    // FantomCurvePoolTokenFetcher,
    // FantomCurveFarmContractPositionFetcher,
    // // Gnosis
    // GnosisCurveBalanceFetcher,
    // GnosisCurvePoolTokenFetcher,
    // GnosisCurveFarmContractPositionFetcher,
    // // Harmony
    // HarmonyCurveBalanceFetcher,
    // HarmonyCurvePoolTokenFetcher,
    // HarmonyCurveFarmContractPositionFetcher,
    // // Optimism
    // OptimismCurveBalanceFetcher,
    // OptimismCurvePoolTokenFetcher,
    // OptimismCurveFarmContractPositionFetcher,
    // // Polygon
    // PolygonCurveBalanceFetcher,
    // PolygonCurvePoolTokenFetcher,
    // PolygonCurveFarmContractPositionFetcher,
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
    CurveFactoryGaugeAddressHelper,
    // Legacy Sidechain/L2 Gauges
    CurveGaugeV2RoiStrategy,
    CurveGaugeV2RewardTokenStrategy,
    // Sidechain/L2 gauges
    CurveChildLiquidityGaugeRoiStrategy,
    CurveChildLiquidityGaugeRewardTokenStrategy,
    CurveChildLiquidityGaugeFactoryAddressHelper,
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
export class CurveAppModule extends AbstractApp() {}
