import { OptimismCurveChildLiquidityGaugeContractPositionFetcher } from './curve.child-liquidity-gauge.contract-position-fetcher';
import { OptimismCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { OptimismCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { OptimismCurveRewardsOnlyGaugeContractPositionFetcher } from './curve.rewards-only-gauge.contract-position-fetcher';
import { OptimismCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const OPTIMISM_CURVE_PROVIDERS = [
  OptimismCurveCryptoPoolTokenFetcher,
  OptimismCurveFactoryStablePoolTokenFetcher,
  OptimismCurveStablePoolTokenFetcher,
  OptimismCurveChildLiquidityGaugeContractPositionFetcher,
  OptimismCurveRewardsOnlyGaugeContractPositionFetcher,
];
