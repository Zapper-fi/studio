import { GnosisCurveCryptoPoolGaugeContractPositionFetcher } from './curve.crypto-pool-gauge.contract-position-fetcher';
import { GnosisCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { GnosisCurveFactoryStablePoolGaugeContractPositionFetcher } from './curve.factory-stable-pool-gauge.contract-position-fetcher';
import { GnosisCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { GnosisCurveStablePoolGaugeContractPositionFetcher } from './curve.stable-pool-gauge.contract-position-fetcher';
import { GnosisCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const GNOSIS_CURVE_PROVIDERS = [
  GnosisCurveCryptoPoolGaugeContractPositionFetcher,
  GnosisCurveCryptoPoolTokenFetcher,
  GnosisCurveFactoryStablePoolGaugeContractPositionFetcher,
  GnosisCurveFactoryStablePoolTokenFetcher,
  GnosisCurveStablePoolGaugeContractPositionFetcher,
  GnosisCurveStablePoolTokenFetcher,
];
