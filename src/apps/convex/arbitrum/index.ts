import { ArbitrumConvexBoosterContractPositionFetcher } from './convex.booster.contract-position-fetcher';
import { ArbitrumConvexDepositTokenFetcher } from './convex.deposit.token-fetcher';

export const CONVEX_ARBITRUM_PROVIDERS = [
  ArbitrumConvexBoosterContractPositionFetcher,
  ArbitrumConvexDepositTokenFetcher,
];
