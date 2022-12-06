import { FantomCurveChildLiquidityGaugeContractPositionFetcher } from './curve.child-liquidity-gauge.contract-position-fetcher';
import { FantomCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { FantomCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { FantomCurveRewardsOnlyGaugeContractPositionFetcher } from './curve.rewards-only-gauge.contract-position-fetcher';
import { FantomCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const FANTOM_CURVE_PROVIDERS = [
  FantomCurveCryptoPoolTokenFetcher,
  FantomCurveFactoryStablePoolTokenFetcher,
  FantomCurveStablePoolTokenFetcher,
  FantomCurveChildLiquidityGaugeContractPositionFetcher,
  FantomCurveRewardsOnlyGaugeContractPositionFetcher,
];
