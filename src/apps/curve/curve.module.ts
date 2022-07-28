import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixContractFactory } from '~apps/synthetix';

import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { EthereumCurveFarmContractPositionFetcher } from './ethereum/curve.farm.contract-position-fetcher';
import { CurveApiClient } from './helpers/api/curve.api.client';
import { CurveChildLiquidityGaugeRoiStrategy } from './helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveGaugeIsActiveStrategy } from './helpers/curve.gauge.is-active-strategy';
import { CurveGaugeRoiStrategy } from './helpers/curve.gauge.roi-strategy';
import { CurveOnChainReserveStrategy } from './helpers/curve.on-chain.reserve-strategy';
import { CurveVestingEscrowContractPositionBalanceHelper } from './helpers/curve.vesting-escrow.contract-position-balance-helper';
import { CurveVestingEscrowContractPositionHelper } from './helpers/curve.vesting-escrow.contract-position-helper';
import { CurveVotingEscrowContractPositionBalanceHelper } from './helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from './helpers/curve.voting-escrow.contract-position-helper';
import { CurveDefaultFarmContractPositionHelper } from './helpers/gauge/curve.default.farm.contract-position-helper';
import { CurveDefaultPoolTokenHelper } from './helpers/pool/curve.default.token-helper';
import { CurvePoolTokenRegistry } from './helpers/pool/curve.pool-token.registry';
import { CurvePoolTokenHelper } from './helpers/pool/curve.pool.token-helper';

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    SynthetixContractFactory,
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
    CurvePoolTokenRegistry,
    CurvePoolTokenHelper,
    CurveDefaultPoolTokenHelper,
    CurveDefaultFarmContractPositionHelper,
    // Token Helper Strategies
    CurveOnChainReserveStrategy,
    // Gauge Helper Strategies
    CurveGaugeIsActiveStrategy,
    CurveGaugeRoiStrategy,
    // Sidechain/L2 gauges
    CurveChildLiquidityGaugeRoiStrategy,
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
    // Voting Escrow Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVestingEscrowContractPositionHelper,
    CurveVestingEscrowContractPositionBalanceHelper,
  ],
})
export class CurveAppModule extends AbstractApp() {}
