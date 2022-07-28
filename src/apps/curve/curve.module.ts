import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCurveBalanceFetcher } from './arbitrum/curve.balance-fetcher';
import { ArbitrumCurveGaugeContractPositionFetcher } from './arbitrum/curve.farm.contract-position-fetcher';
import { ArbitrumCurvePoolTokenFetcher } from './arbitrum/curve.pool.token-fetcher';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { CurveApiClient } from './helpers/curve.api.client';
import { CurveChildLiquidityGaugeRoiStrategy } from './helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveGaugeDefaultContractPositionHelper } from './helpers/curve.gauge.default.contract-position-helper';
import { CurveGaugeIsActiveStrategy } from './helpers/curve.gauge.is-active-strategy';
import { CurveGaugeRegistry } from './helpers/curve.gauge.registry';
import { CurveGaugeRoiStrategy } from './helpers/curve.gauge.roi-strategy';
import { CurvePoolDefaultTokenHelper } from './helpers/curve.pool.default.token-helper';
import { CurvePoolRegistry } from './helpers/curve.pool.registry';
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
    ArbitrumCurveBalanceFetcher,
    ArbitrumCurvePoolTokenFetcher,
    ArbitrumCurveGaugeContractPositionFetcher,
    // // Avalanche
    // AvalancheCurveBalanceFetcher,
    // AvalancheCurvePoolTokenFetcher,
    // AvalancheCurveGaugeContractPositionFetcher,
    // // Ethereum
    // EthereumCurveBalanceFetcher,
    // EthereumCurvePoolTokenFetcher,
    // EthereumCurveGaugeContractPositionFetcher,
    // EthereumCurveVotingEscrowContractPositionFetcher,
    // EthereumCurveVestingEscrowContractPositionFetcher,
    // // Fantom
    // FantomCurveBalanceFetcher,
    // FantomCurvePoolTokenFetcher,
    // FantomCurveGaugeContractPositionFetcher,
    // // Gnosis
    // GnosisCurveBalanceFetcher,
    // GnosisCurvePoolTokenFetcher,
    // GnosisCurveGaugeContractPositionFetcher,
    // // Harmony
    // HarmonyCurveBalanceFetcher,
    // HarmonyCurvePoolTokenFetcher,
    // HarmonyCurveGaugeContractPositionFetcher,
    // // Optimism
    // OptimismCurveBalanceFetcher,
    // OptimismCurvePoolTokenFetcher,
    // OptimismCurveGaugeContractPositionFetcher,
    // // Polygon
    // PolygonCurveBalanceFetcher,
    // PolygonCurvePoolTokenFetcher,
    // PolygonCurveGaugeContractPositionFetcher,
    // Token Helpers
    CurveApiClient,
    CurvePoolRegistry,
    CurvePoolTokenHelper,
    CurvePoolDefaultTokenHelper,
    CurvePoolVirtualPriceStrategy,
    CurveGaugeRegistry,
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
    CurveGaugeRegistry,
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
