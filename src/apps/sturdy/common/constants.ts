import { Network } from '~types';

export type VaultMonitoringResponse = {
  chain: string;
  tokens: string;
  decimals: number;
  address: string;
  supply: number;
  price: number;
  base: number;
  reward: number;
  rewards: {
    CRV: number;
    CVX: number;
  };
  url: number;
  tvl: number;
  active: boolean;
}[];

export const TIMEOUT_DURATION = 15 * 60 * 1000;

/**
 * Creates a unique primary key used for caching API responses
 * @param appId The application's unique identifier
 * @param groupId The application's unique group identifier
 * @param network Network where the application is deployed
 * @returns string
 */
export function cacheOnIntervalKeyCreationHelper(appId: string, groupId: string, network: Network): string {
  return `studio:${appId}:${groupId}:${network}:addresses`;
}
