import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { EthereumCurveCryptoPoolGaugeContractPositionFetcher } from './ethereum/curve.crypto-pool-gauge.contract-position-fetcher';
import { EthereumCurveStablePoolGaugeContractPositionFetcher } from './ethereum/curve.stable-pool-gauge.contract-position-fetcher';

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    // Ethereum
    // EthereumCurveStablePoolTokenFetcher,
    // EthereumCurveCryptoPoolTokenFetcher,
    // EthereumCurveFactoryStablePoolTokenFetcher,
    // EthereumCurveFactoryCryptoPoolTokenFetcher,
    EthereumCurveStablePoolGaugeContractPositionFetcher,
    EthereumCurveCryptoPoolGaugeContractPositionFetcher,

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
