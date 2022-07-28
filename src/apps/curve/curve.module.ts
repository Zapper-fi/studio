import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { EthereumCurveFarmContractPositionFetcher } from './ethereum/curve.farm.contract-position-fetcher';
import { CurveApiClient } from './helpers/curve.api.client';
import { CurveChildLiquidityGaugeRoiStrategy } from './helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveGaugeDefaultContractPositionHelper } from './helpers/curve.gauge.default.contract-position-helper';
import { CurveGaugeIsActiveStrategy } from './helpers/curve.gauge.is-active-strategy';
import { CurveGaugeRoiStrategy } from './helpers/curve.gauge.roi-strategy';
import { CurvePoolDefaultTokenHelper } from './helpers/curve.pool.default.token-helper';
import { CurvePoolRegistry } from './helpers/curve.pool.registry';
import { CurvePoolReserveStrategy } from './helpers/curve.pool.reserve-strategy';
import { CurvePoolTokenHelper } from './helpers/curve.pool.token-helper';
import { CurvePoolVirtualPriceStrategy } from './helpers/curve.pool.virtual.price-strategy';
import { CurveVestingEscrowContractPositionBalanceHelper } from './helpers/curve.vesting-escrow.contract-position-balance-helper';
import { CurveVestingEscrowContractPositionHelper } from './helpers/curve.vesting-escrow.contract-position-helper';
import { CurveVotingEscrowContractPositionBalanceHelper } from './helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from './helpers/curve.voting-escrow.contract-position-helper';

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
    // AvalancheCurveBalanceFetcher,
    // AvalancheCurvePoolTokenFetcher,
    // AvalancheCurveFarmContractPositionFetcher,
    // // Ethereum
    // EthereumCurveBalanceFetcher,
    // EthereumCurvePoolTokenFetcher,
    EthereumCurveFarmContractPositionFetcher,
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
    CurvePoolRegistry,
    CurvePoolTokenHelper,
    CurvePoolDefaultTokenHelper,
    CurvePoolReserveStrategy,
    CurvePoolVirtualPriceStrategy,
    CurveGaugeDefaultContractPositionHelper,
    CurveGaugeIsActiveStrategy,
    CurveGaugeRoiStrategy,
    CurveChildLiquidityGaugeRoiStrategy,
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVestingEscrowContractPositionHelper,
    CurveVestingEscrowContractPositionBalanceHelper,
  ],
  exports: [
    CurveContractFactory,
    CurveApiClient,
    CurvePoolRegistry,
    CurvePoolTokenHelper,
    CurvePoolDefaultTokenHelper,
    CurvePoolReserveStrategy,
    CurveGaugeDefaultContractPositionHelper,
    CurveGaugeIsActiveStrategy,
    CurveGaugeRoiStrategy,
    CurveChildLiquidityGaugeRoiStrategy,
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVestingEscrowContractPositionHelper,
    CurveVestingEscrowContractPositionBalanceHelper,
  ],
})
export class CurveAppModule extends AbstractApp() {}
