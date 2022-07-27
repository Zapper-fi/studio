import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCurvePoolTokenFetcher } from './arbitrum/curve.pool.token-fetcher';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { CurveApiClient } from './helpers/api/curve.api.client';
import { CurveChildLiquidityGaugeFactoryAddressHelper } from './helpers/curve.child-liquidity-gauge-factory.address-helper';
import { CurveChildLiquidityGaugeRewardTokenStrategy } from './helpers/curve.child-liquidity-gauge.reward-token-strategy';
import { CurveChildLiquidityGaugeRoiStrategy } from './helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveFactoryGaugeAddressHelper } from './helpers/curve.factory-gauge.address-helper';
import { CurveGaugeIsActiveStrategy } from './helpers/curve.gauge.is-active-strategy';
import { CurveGaugeRoiStrategy } from './helpers/curve.gauge.roi-strategy';
import { CurveOnChainReserveStrategy } from './helpers/curve.on-chain.reserve-strategy';
import { CurveRewardsOnlyGaugeRewardTokenStrategy } from './helpers/curve.rewards-only-gauge.reward-token-strategy';
import { CurveRewardsOnlyGaugeRoiStrategy } from './helpers/curve.rewards-only-gauge.roi-strategy';
import { CurveVestingEscrowContractPositionBalanceHelper } from './helpers/curve.vesting-escrow.contract-position-balance-helper';
import { CurveVestingEscrowContractPositionHelper } from './helpers/curve.vesting-escrow.contract-position-helper';
import { CurveVotingEscrowContractPositionBalanceHelper } from './helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from './helpers/curve.voting-escrow.contract-position-helper';
import { CurveDefaultPoolTokenHelper } from './helpers/pool-token/curve.default.token-helper';
import { CurvePoolTokenRegistry } from './helpers/pool-token/curve.pool-token.registry';
import { CurvePoolTokenHelper } from './helpers/pool-token/curve.pool.token-helper';

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    // Arbitrum
    // ArbitrumCurveBalanceFetcher,
    ArbitrumCurvePoolTokenFetcher,
    // ArbitrumCurveFarmContractPositionFetcher,
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
    CurveApiClient,
    CurvePoolTokenRegistry,
    CurvePoolTokenHelper,
    CurveDefaultPoolTokenHelper,
    // Token Helper Strategies
    CurveOnChainReserveStrategy,
    // Gauge Helper Strategies
    CurveGaugeIsActiveStrategy,
    CurveGaugeRoiStrategy,
    CurveFactoryGaugeAddressHelper,
    // Legacy Sidechain/L2 Gauges
    CurveRewardsOnlyGaugeRoiStrategy,
    CurveRewardsOnlyGaugeRewardTokenStrategy,
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
    CurveDefaultPoolTokenHelper,
    // Token Helper Strategies
    CurveOnChainReserveStrategy,
    // Gauge Helper Strategies
    CurveGaugeIsActiveStrategy,
    CurveGaugeRoiStrategy,
    CurveRewardsOnlyGaugeRoiStrategy,
    CurveRewardsOnlyGaugeRewardTokenStrategy,
    CurveFactoryGaugeAddressHelper,
    // Voting Escrow Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVestingEscrowContractPositionHelper,
    CurveVestingEscrowContractPositionBalanceHelper,
  ],
})
export class CurveAppModule extends AbstractApp() {}
