import { PolygonConvexBoosterContractPositionFetcher } from './convex.booster.contract-position-fetcher';
import { PolygonConvexDepositTokenFetcher } from './convex.deposit.token-fetcher';
import { PolygonConvexLpFarmContractPositionFetcher } from './convex.lp-farm.contract-position-fetcher';

export const CONVEX_POLYGON_PROVIDERS = [
  PolygonConvexBoosterContractPositionFetcher,
  PolygonConvexDepositTokenFetcher,
  PolygonConvexLpFarmContractPositionFetcher,
];
