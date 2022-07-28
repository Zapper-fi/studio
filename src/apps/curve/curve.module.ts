import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCurveBalanceFetcher } from './arbitrum/curve.balance-fetcher';
import { ArbitrumCurveGaugeContractPositionFetcher } from './arbitrum/curve.farm.contract-position-fetcher';
import { ArbitrumCurvePoolTokenFetcher } from './arbitrum/curve.pool.token-fetcher';
import { AvalancheCurveBalanceFetcher } from './avalanche/curve.balance-fetcher';
import { AvalancheCurvePoolTokenFetcher } from './avalanche/curve.pool.token-fetcher';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { EthereumCurveBalanceFetcher } from './ethereum/curve.balance-fetcher';
import { EthereumCurveGaugeContractPositionFetcher } from './ethereum/curve.farm.contract-position-fetcher';
import { EthereumCurvePoolTokenFetcher } from './ethereum/curve.pool.token-fetcher';
import { EthereumCurveVestingEscrowContractPositionFetcher } from './ethereum/curve.vesting-escrow.contract-position-fetcher';
import { EthereumCurveVotingEscrowContractPositionFetcher } from './ethereum/curve.voting-escrow.contract-position-fetcher';
import { FantomCurveBalanceFetcher } from './fantom/curve.balance-fetcher';
import { FantomCurveGaugeContractPositionFetcher } from './fantom/curve.farm.contract-position-fetcher';
import { FantomCurvePoolTokenFetcher } from './fantom/curve.pool.token-fetcher';
import { GnosisCurveBalanceFetcher } from './gnosis/curve.balance-fetcher';
import { GnosisCurveGaugeContractPositionFetcher } from './gnosis/curve.farm.contract-position-fetcher';
import { GnosisCurvePoolTokenFetcher } from './gnosis/curve.pool.token-fetcher';
import { HarmonyCurveBalanceFetcher } from './harmony/curve.balance-fetcher';
import { HarmonyCurveGaugeContractPositionFetcher } from './harmony/curve.farm.contract-position-fetcher';
import { HarmonyCurvePoolTokenFetcher } from './harmony/curve.pool.token-fetcher';
import { CurveApiClient } from './helpers/curve.api.client';
import { CurveChildLiquidityGaugeRoiStrategy } from './helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveGaugeDefaultContractPositionBalanceHelper } from './helpers/curve.gauge.default.contract-position-balance-helper';
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
import { OptimismCurveBalanceFetcher } from './optimism/curve.balance-fetcher';
import { OptimismCurveGaugeContractPositionFetcher } from './optimism/curve.farm.contract-position-fetcher';
import { OptimismCurvePoolTokenFetcher } from './optimism/curve.pool.token-fetcher';
import { PolygonCurveBalanceFetcher } from './polygon/curve.balance-fetcher';
import { PolygonCurveGaugeContractPositionFetcher } from './polygon/curve.farm.contract-position-fetcher';
import { PolygonCurvePoolTokenFetcher } from './polygon/curve.pool.token-fetcher';

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
    AvalancheCurveBalanceFetcher,
    AvalancheCurvePoolTokenFetcher,
    ArbitrumCurveGaugeContractPositionFetcher,
    // // Ethereum
    EthereumCurveBalanceFetcher,
    EthereumCurvePoolTokenFetcher,
    EthereumCurveGaugeContractPositionFetcher,
    EthereumCurveVotingEscrowContractPositionFetcher,
    EthereumCurveVestingEscrowContractPositionFetcher,
    // // Fantom
    FantomCurveBalanceFetcher,
    FantomCurvePoolTokenFetcher,
    FantomCurveGaugeContractPositionFetcher,
    // // Gnosis
    GnosisCurveBalanceFetcher,
    GnosisCurvePoolTokenFetcher,
    GnosisCurveGaugeContractPositionFetcher,
    // // Harmony
    HarmonyCurveBalanceFetcher,
    HarmonyCurvePoolTokenFetcher,
    HarmonyCurveGaugeContractPositionFetcher,
    // // Optimism
    OptimismCurveBalanceFetcher,
    OptimismCurvePoolTokenFetcher,
    OptimismCurveGaugeContractPositionFetcher,
    // // Polygon
    PolygonCurveBalanceFetcher,
    PolygonCurvePoolTokenFetcher,
    PolygonCurveGaugeContractPositionFetcher,
    // Token Helpers
    CurveApiClient,
    CurvePoolRegistry,
    CurvePoolTokenHelper,
    CurvePoolDefaultTokenHelper,
    CurvePoolVirtualPriceStrategy,
    CurveGaugeRegistry,
    CurveGaugeDefaultContractPositionHelper,
    CurveGaugeDefaultContractPositionBalanceHelper,
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
    CurveGaugeDefaultContractPositionBalanceHelper,
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
