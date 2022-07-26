import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheCurveBalanceFetcher } from './avalanche/curve.balance-fetcher';
import { AvalancheCurveFarmContractPositionFetcher } from './avalanche/curve.farm.contract-position-fetcher';
import { AvalancheCurvePoolTokenFetcher } from './avalanche/curve.pool.token-fetcher';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { CurveApiClient } from './helpers/api/curve.api.client';
import { CurveApiVolumeStrategy } from './helpers/curve.api.volume-strategy';
import { CurveChildLiquidityGaugeFactoryAddressHelper } from './helpers/curve.child-liquidity-gauge-factory.address-helper';
import { CurveChildLiquidityGaugeRewardTokenStrategy } from './helpers/curve.child-liquidity-gauge.reward-token-strategy';
import { CurveChildLiquidityGaugeRoiStrategy } from './helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveCryptoFactoryPoolTokenHelper } from './helpers/curve.crypto-factory-pool.token-helper';
import { CurveCryptoFactoryPoolDefinitionStrategy } from './helpers/curve.crypto-factory.pool-definition-strategy';
import { CurveCryptoPoolTokenHelper } from './helpers/curve.crypto-pool.token-helper';
import { CurveFactoryGaugeAddressHelper } from './helpers/curve.factory-gauge.address-helper';
import { CurveFactoryPoolTokenHelper } from './helpers/curve.factory-pool.token-helper';
import { CurveFactoryPoolDefinitionStrategy } from './helpers/curve.factory.pool-definition-strategy';
import { CurveGaugeIsActiveStrategy } from './helpers/curve.gauge.is-active-strategy';
import { CurveGaugeRoiStrategy } from './helpers/curve.gauge.roi-strategy';
import { CurveLiquidityAndVirtualPriceStrategy } from './helpers/curve.liquidity-and-virtual.price-strategy';
import { CurveLiquidityPriceStrategy } from './helpers/curve.liquidity.price-strategy';
import { CurveOnChainCoinStrategy } from './helpers/curve.on-chain.coin-strategy';
import { CurveOnChainReserveStrategy } from './helpers/curve.on-chain.reserve-strategy';
import { CurveOnChainVolumeStrategy } from './helpers/curve.on-chain.volume-strategy';
import { CurvePoolTokenHelper } from './helpers/curve.pool.token-helper';
import { CurveRewardsOnlyGaugeRewardTokenStrategy } from './helpers/curve.rewards-only-gauge.reward-token-strategy';
import { CurveRewardsOnlyGaugeRoiStrategy } from './helpers/curve.rewards-only-gauge.roi-strategy';
import { CurveStablePoolTokenHelper } from './helpers/curve.stable-pool.token-helper';
import { CurveVestingEscrowContractPositionBalanceHelper } from './helpers/curve.vesting-escrow.contract-position-balance-helper';
import { CurveVestingEscrowContractPositionHelper } from './helpers/curve.vesting-escrow.contract-position-helper';
import { CurveVirtualPriceStrategy } from './helpers/curve.virtual.price-strategy';
import { CurveVotingEscrowContractPositionBalanceHelper } from './helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from './helpers/curve.voting-escrow.contract-position-helper';
import { CurveOnChainRegistry } from './helpers/registry/curve.on-chain.registry';

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    // Arbitrum
    // ArbitrumCurveBalanceFetcher,
    // ArbitrumCurvePoolTokenFetcher,
    // ArbitrumCurveFarmContractPositionFetcher,
    // // Avalanche
    AvalancheCurveBalanceFetcher,
    AvalancheCurvePoolTokenFetcher,
    AvalancheCurveFarmContractPositionFetcher,
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
    CurveOnChainRegistry,
    CurvePoolTokenHelper,
    CurveStablePoolTokenHelper,
    CurveCryptoPoolTokenHelper,
    CurveFactoryPoolTokenHelper,
    CurveCryptoFactoryPoolTokenHelper,
    // Token Helper Strategies
    CurveApiVolumeStrategy,
    CurveOnChainVolumeStrategy,
    CurveOnChainCoinStrategy,
    CurveOnChainReserveStrategy,
    CurveVirtualPriceStrategy,
    CurveLiquidityPriceStrategy,
    CurveLiquidityAndVirtualPriceStrategy,
    CurveFactoryPoolDefinitionStrategy,
    CurveCryptoFactoryPoolDefinitionStrategy,
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
    CurveStablePoolTokenHelper,
    CurveCryptoPoolTokenHelper,
    CurveFactoryPoolTokenHelper,
    CurveCryptoFactoryPoolTokenHelper,
    // Token Helper Strategies
    CurveApiVolumeStrategy,
    CurveOnChainVolumeStrategy,
    CurveOnChainCoinStrategy,
    CurveOnChainReserveStrategy,
    CurveVirtualPriceStrategy,
    CurveLiquidityPriceStrategy,
    CurveLiquidityAndVirtualPriceStrategy,
    CurveFactoryPoolDefinitionStrategy,
    CurveCryptoFactoryPoolDefinitionStrategy,
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
