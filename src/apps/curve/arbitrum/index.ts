import { ArbitrumCurveChildLiquidityGaugeContractPositionFetcher } from './curve.child-liquidity-gauge.contract-position-fetcher';
import { ArbitrumCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { ArbitrumCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { ArbitrumCurveRewardsOnlyGaugeContractPositionFetcher } from './curve.rewards-only-gauge.contract-position-fetcher';
import { ArbitrumCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const ARBITRUM_CURVE_PROVIDERS = [
  ArbitrumCurveCryptoPoolTokenFetcher,
  ArbitrumCurveFactoryStablePoolTokenFetcher,
  ArbitrumCurveStablePoolTokenFetcher,
  ArbitrumCurveChildLiquidityGaugeContractPositionFetcher,
  ArbitrumCurveRewardsOnlyGaugeContractPositionFetcher,
];
