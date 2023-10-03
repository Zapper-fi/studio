import { BaseCurveChildLiquidityGaugeContractPositionFetcher } from './curve.child-liquidity-gauge.contract-position-fetcher';
import { BaseCurveFactoryCryptoPoolTokenFetcher } from './curve.factory-crypto-pool.token-fetcher';
import { BaseCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { BaseCurveTricryptoPoolTokenFetcher } from './curve.tricrypto-pool.token-fetcher';

export const BASE_CURVE_PROVIDERS = [
  BaseCurveChildLiquidityGaugeContractPositionFetcher,
  BaseCurveFactoryCryptoPoolTokenFetcher,
  BaseCurveFactoryStablePoolTokenFetcher,
  BaseCurveTricryptoPoolTokenFetcher,
];
