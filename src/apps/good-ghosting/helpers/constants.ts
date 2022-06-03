import BigNumber from 'bignumber.js';

export enum ABIVersion {
  v001 = '0.0.1',
  v002 = '0.0.2',
  v003 = '0.0.3',
}

const ZERO_BN = new BigNumber(0);
export { BigNumber as BN, ZERO_BN };
