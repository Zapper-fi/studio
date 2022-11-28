import { PolygonCurveChildLiquidityGaugeContractPositionFetcher } from './curve.child-liquidity-gauge.contract-position-fetcher';
import { PolygonCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { PolygonCurveFactoryCryptoPoolTokenFetcher } from './curve.factory-crypto-pool.token-fetcher';
import { PolygonCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { PolygonCurveRewardsOnlyGaugeContractPositionFetcher } from './curve.rewards-only-gauge.contract-position-fetcher';
import { PolygonCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const POLYGON_CURVE_PROVIDERS = [
  PolygonCurveCryptoPoolTokenFetcher,
  PolygonCurveFactoryCryptoPoolTokenFetcher,
  PolygonCurveFactoryStablePoolTokenFetcher,
  PolygonCurveStablePoolTokenFetcher,
  PolygonCurveChildLiquidityGaugeContractPositionFetcher,
  PolygonCurveRewardsOnlyGaugeContractPositionFetcher,
];
