import { GnosisCurveChildLiquidityGaugeContractPositionFetcher } from './curve.child-liquidity-gauge.contract-position-fetcher';
import { GnosisCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { GnosisCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { GnosisCurveRewardsOnlyGaugeContractPositionFetcher } from './curve.rewards-only-gauge.contract-position-fetcher';
import { GnosisCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const GNOSIS_CURVE_PROVIDERS = [
  GnosisCurveCryptoPoolTokenFetcher,
  GnosisCurveFactoryStablePoolTokenFetcher,
  GnosisCurveStablePoolTokenFetcher,
  GnosisCurveChildLiquidityGaugeContractPositionFetcher,
  GnosisCurveRewardsOnlyGaugeContractPositionFetcher,
];
