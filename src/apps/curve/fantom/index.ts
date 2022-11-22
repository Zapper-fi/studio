import { FantomCurveCryptoPoolGaugeContractPositionFetcher } from './curve.crypto-pool-gauge.contract-position-fetcher';
import { FantomCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { FantomCurveFactoryStablePoolGaugeContractPositionFetcher } from './curve.factory-stable-pool-gauge.contract-position-fetcher';
import { FantomCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { FantomCurveStablePoolGaugeContractPositionFetcher } from './curve.stable-pool-gauge.contract-position-fetcher';
import { FantomCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const FANTOM_CURVE_PROVIDERS = [
  FantomCurveCryptoPoolGaugeContractPositionFetcher,
  FantomCurveCryptoPoolTokenFetcher,
  FantomCurveFactoryStablePoolGaugeContractPositionFetcher,
  FantomCurveFactoryStablePoolTokenFetcher,
  FantomCurveStablePoolGaugeContractPositionFetcher,
  FantomCurveStablePoolTokenFetcher,
];
