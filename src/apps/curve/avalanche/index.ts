import { AvalancheCurveChildLiquidityGaugeContractPositionFetcher } from './curve.child-liquidity-gauge.contract-position-fetcher';
import { AvalancheCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { AvalancheCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { AvalancheCurveRewardsOnlyGaugeContractPositionFetcher } from './curve.rewards-only-gauge.contract-position-fetcher';
import { AvalancheCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const AVALANCHE_CURVE_PROVIDERS = [
  AvalancheCurveCryptoPoolTokenFetcher,
  AvalancheCurveFactoryStablePoolTokenFetcher,
  AvalancheCurveStablePoolTokenFetcher,
  AvalancheCurveChildLiquidityGaugeContractPositionFetcher,
  AvalancheCurveRewardsOnlyGaugeContractPositionFetcher,
];
