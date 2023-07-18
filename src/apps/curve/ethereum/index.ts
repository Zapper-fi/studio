import { EthereumCurveCrvUsdPoolTokenFetcher } from './curve.crv-usd-pool.token-fetcher';
import { EthereumCurveCryptoPoolGaugeContractPositionFetcher } from './curve.crypto-pool-gauge.contract-position-fetcher';
import { EthereumCurveCryptoPoolTokenFetcher } from './curve.crypto-pool.token-fetcher';
import { EthereumCurveFactoryCryptoPoolGaugeContractPositionFetcher } from './curve.factory-crypto-pool-gauge.contract-position-fetcher';
import { EthereumCurveFactoryCryptoPoolTokenFetcher } from './curve.factory-crypto-pool.token-fetcher';
import { EthereumCurveFactoryStablePoolGaugeContractPositionFetcher } from './curve.factory-stable-pool-gauge.contract-position-fetcher';
import { EthereumCurveFactoryStablePoolTokenFetcher } from './curve.factory-stable-pool.token-fetcher';
import { EthereumCurveStablePoolGaugeContractPositionFetcher } from './curve.stable-pool-gauge.contract-position-fetcher';
import { EthereumCurveStablePoolTokenFetcher } from './curve.stable-pool.token-fetcher';
import { EthereumCurveTricryptoPoolTokenFetcher } from './curve.tricrypto-pool.token-fetcher';
import { EthereumCurveVestingEscrowContractPositionFetcher } from './curve.vesting-escrow.contract-position-fetcher';
import { EthereumCurveVotingEscrowContractPositionFetcher } from './curve.voting-escrow.contract-position-fetcher';

export const ETHEREUM_CURVE_PROVIDERS = [
  EthereumCurveCryptoPoolGaugeContractPositionFetcher,
  EthereumCurveCryptoPoolTokenFetcher,
  EthereumCurveTricryptoPoolTokenFetcher,
  EthereumCurveCrvUsdPoolTokenFetcher,
  EthereumCurveFactoryCryptoPoolGaugeContractPositionFetcher,
  EthereumCurveFactoryCryptoPoolTokenFetcher,
  EthereumCurveFactoryStablePoolGaugeContractPositionFetcher,
  EthereumCurveFactoryStablePoolTokenFetcher,
  EthereumCurveStablePoolGaugeContractPositionFetcher,
  EthereumCurveStablePoolTokenFetcher,
  EthereumCurveVestingEscrowContractPositionFetcher,
  EthereumCurveVotingEscrowContractPositionFetcher,
];
