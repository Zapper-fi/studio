import { OptimismCurveCryptoPoolGaugeContractPositionFetcher } from './curve.crypto-pool-gauge.contract-position-fetcher';
import { OptimismCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { OptimismCurveFactoryStablePoolGaugeContractPositionFetcher } from './curve.factory-stable-pool-gauge.contract-position-fetcher';
import { OptimismCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { OptimismCurveStablePoolGaugeContractPositionFetcher } from './curve.stable-pool-gauge.contract-position-fetcher';
import { OptimismCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const OPTIMISM_CURVE_PROVIDERS = [
  OptimismCurveCryptoPoolGaugeContractPositionFetcher,
  OptimismCurveCryptoPoolTokenFetcher,
  OptimismCurveFactoryStablePoolGaugeContractPositionFetcher,
  OptimismCurveFactoryStablePoolTokenFetcher,
  OptimismCurveStablePoolGaugeContractPositionFetcher,
  OptimismCurveStablePoolTokenFetcher,
];
