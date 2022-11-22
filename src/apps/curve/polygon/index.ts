import { PolygonCurveCryptoPoolGaugeContractPositionFetcher } from './curve.crypto-pool-gauge.contract-position-fetcher';
import { PolygonCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { PolygonCurveFactoryCryptoPoolGaugeContractPositionFetcher } from './curve.factory-crypto-pool-gauge.contract-position-fetcher';
import { PolygonCurveFactoryCryptoPoolTokenFetcher } from './curve.factory-crypto-pool.token-fetcher';
import { PolygonCurveFactoryStablePoolGaugeContractPositionFetcher } from './curve.factory-stable-pool-gauge.contract-position-fetcher';
import { PolygonCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { PolygonCurveStablePoolGaugeContractPositionFetcher } from './curve.stable-pool-gauge.contract-position-fetcher';
import { PolygonCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const POLYGON_CURVE_PROVIDERS = [
  PolygonCurveCryptoPoolGaugeContractPositionFetcher,
  PolygonCurveCryptoPoolTokenFetcher,
  PolygonCurveFactoryCryptoPoolGaugeContractPositionFetcher,
  PolygonCurveFactoryCryptoPoolTokenFetcher,
  PolygonCurveFactoryStablePoolGaugeContractPositionFetcher,
  PolygonCurveFactoryStablePoolTokenFetcher,
  PolygonCurveStablePoolGaugeContractPositionFetcher,
  PolygonCurveStablePoolTokenFetcher,
];
