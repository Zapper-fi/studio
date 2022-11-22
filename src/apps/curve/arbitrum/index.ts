import { ArbitrumCurveCryptoPoolGaugeContractPositionFetcher } from './curve.crypto-pool-gauge.contract-position-fetcher';
import { ArbitrumCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { ArbitrumCurveFactoryStablePoolGaugeContractPositionFetcher } from './curve.factory-stable-pool-gauge.contract-position-fetcher';
import { ArbitrumCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { ArbitrumCurveStablePoolGaugeContractPositionFetcher } from './curve.stable-pool-gauge.contract-position-fetcher';
import { ArbitrumCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';

export const ARBITRUM_CURVE_PROVIDERS = [
  ArbitrumCurveCryptoPoolGaugeContractPositionFetcher,
  ArbitrumCurveCryptoPoolTokenFetcher,
  ArbitrumCurveFactoryStablePoolGaugeContractPositionFetcher,
  ArbitrumCurveFactoryStablePoolTokenFetcher,
  ArbitrumCurveStablePoolGaugeContractPositionFetcher,
  ArbitrumCurveStablePoolTokenFetcher,
];
