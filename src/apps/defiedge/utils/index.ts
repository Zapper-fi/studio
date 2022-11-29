import axios from 'axios';
import { BigNumber } from 'ethers';

export const DEFIEDGE_BASE_URL = 'https://api.defiedge.io';
export const DEFIEDGE_SUBGRAPH_BASE_URL = 'https://api.thegraph.com/subgraphs/name/unbound-finance';

const promises: Record<string, Promise<number> | undefined> = {};

export function getTokenPrice(symbol: string): Promise<number> {
  let promise = promises[symbol];

  if (promise) return promise;

  promise = axios
    .get<{ USD: number }>(`${DEFIEDGE_BASE_URL}/${symbol}/price`)
    .then(({ data }) => data.USD)
    .catch(() => 0)
    .finally(() => setTimeout(() => delete promises[symbol], 15000));

  return promise;
}

export function expandTo18Decimals(value: BigNumber, decimals?: number): BigNumber {
  return value.mul(BigNumber.from(10).pow(BigNumber.from(18).sub(BigNumber.from(decimals ?? 0))));
}

export function filterNulls<T>(a: T | null): a is T {
  return Boolean(a);
}
