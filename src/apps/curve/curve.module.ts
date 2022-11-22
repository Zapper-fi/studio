import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CurveVolumeDataLoader } from './common/curve.volume.data-loader';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { ETHEREUM_CURVE_PROVIDERS } from './ethereum';

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    CurveVolumeDataLoader,
    ...ETHEREUM_CURVE_PROVIDERS,

    // OLDDD
    // // Arbitrum
    // ArbitrumCurveBalanceFetcher,
    // ArbitrumCurvePoolTokenFetcher,
    // ArbitrumCurveGaugeContractPositionFetcher,
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
    // // Optimism
    // OptimismCurveBalanceFetcher,
    // OptimismCurvePoolTokenFetcher,
    // OptimismCurveGaugeContractPositionFetcher,
    // // Polygon
    // PolygonCurveBalanceFetcher,
    // PolygonCurvePoolTokenFetcher,
    // PolygonCurveGaugeContractPositionFetcher,
    // // API Helpers
    // CurveApiClient,
    // // Pool Token Helpers
    // CurvePoolRegistry,
    // CurvePoolTokenHelper,
    // CurvePoolDefaultTokenHelper,
    // CurvePoolVirtualPriceStrategy,
    // CurvePoolOnChainCoinStrategy,
    // CurvePoolOnChainReserveStrategy,
    // // Gauge Helpers
    // CurveGaugeRegistry,
    // CurveGaugeDefaultContractPositionHelper,
    // CurveGaugeDefaultContractPositionBalanceHelper,
    // CurveGaugeIsActiveStrategy,
    // CurveGaugeRoiStrategy,
    // CurveChildLiquidityGaugeRoiStrategy,
    // // Escrow Helpers
    // CurveVotingEscrowContractPositionHelper,
    // CurveVotingEscrowContractPositionBalanceHelper,
    // CurveVestingEscrowContractPositionHelper,
    // CurveVestingEscrowContractPositionBalanceHelper,
  ],
  exports: [
    // CurveContractFactory,
    // // API Helpers
    // CurveApiClient,
    // // Pool Token Helpers
    // CurvePoolRegistry,
    // CurvePoolTokenHelper,
    // CurvePoolDefaultTokenHelper,
    // CurvePoolVirtualPriceStrategy,
    // CurvePoolOnChainCoinStrategy,
    // CurvePoolOnChainReserveStrategy,
    // // Gauge Helpers
    // CurveGaugeRegistry,
    // CurveGaugeDefaultContractPositionHelper,
    // CurveGaugeDefaultContractPositionBalanceHelper,
    // CurveGaugeIsActiveStrategy,
    // CurveGaugeRoiStrategy,
    // CurveChildLiquidityGaugeRoiStrategy,
    // // Escrow Helpers
    // CurveVotingEscrowContractPositionHelper,
    // CurveVotingEscrowContractPositionBalanceHelper,
    // CurveVestingEscrowContractPositionHelper,
    // CurveVestingEscrowContractPositionBalanceHelper,
  ],
})
export class CurveAppModule extends AbstractApp() {}
