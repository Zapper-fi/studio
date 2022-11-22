import { AvalancheCurveCryptoPoolGaugeContractPositionFetcher } from './curve.crypto-pool-gauge.contract-position-fetcher';
import { AvalancheCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { AvalancheCurveFactoryStablePoolGaugeContractPositionFetcher } from './curve.factory-stable-pool-gauge.contract-position-fetcher';
import { AvalancheCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { AvalancheCurveStablePoolGaugeContractPositionFetcher } from './curve.stable-pool-gauge.contract-position-fetcher';
import { AvalancheCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const AVALANCHE_CURVE_PROVIDERS = [
  AvalancheCurveCryptoPoolGaugeContractPositionFetcher,
  AvalancheCurveCryptoPoolTokenFetcher,
  AvalancheCurveFactoryStablePoolGaugeContractPositionFetcher,
  AvalancheCurveFactoryStablePoolTokenFetcher,
  AvalancheCurveStablePoolGaugeContractPositionFetcher,
  AvalancheCurveStablePoolTokenFetcher,
];
