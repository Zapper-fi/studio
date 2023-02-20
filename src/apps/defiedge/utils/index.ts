import { BigNumber } from 'ethers';

export const DEFIEDGE_BASE_URL = 'https://api.defiedge.io';

export function expandTo18Decimals(value: BigNumber, decimals?: number): BigNumber {
  return value.mul(BigNumber.from(10).pow(BigNumber.from(18).sub(BigNumber.from(decimals ?? 0))));
}
