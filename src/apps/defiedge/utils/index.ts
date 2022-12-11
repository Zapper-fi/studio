import axios from 'axios';
import { BigNumber } from 'ethers';

import { Network } from '~types';

import { Strategy } from '../types/defiedge.types';

export const DEFIEDGE_BASE_URL = 'https://api.defiedge.io';

export function expandTo18Decimals(value: BigNumber, decimals?: number): BigNumber {
  return value.mul(BigNumber.from(10).pow(BigNumber.from(18).sub(BigNumber.from(decimals ?? 0))));
}

export function filterNulls<T>(a: T | null): a is T {
  return Boolean(a);
}

export async function getDefiStrategies(network: Network) {
  const networkParam = network === Network.ETHEREUM_MAINNET ? 'mainnet' : network;
  const endpoint = `${DEFIEDGE_BASE_URL}/${networkParam}/strategies`;

  return await axios.get<Strategy[]>(endpoint).then(({ data }) => data);
}
