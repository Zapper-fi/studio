import { DefaultDataProps } from '~position/display.interface';

export type VendorFinancePoolDataProps = DefaultDataProps & {
  deployer: string;
  totalDeposited: number;
};

export type VendorFinancePoolDefinition = {
  address: string;
  deployer: string;
  mintRatio: string;
  colToken: string;
  lendToken: string;
  expiry: string;
  feeRate: string;
  lendBalance: string;
  totalBorrowed: string;
};

export type VendorLendingPool = {
  id: string;
  _deployer: string;
  _mintRatio: string;
  _colToken: string;
  _lendToken: string;
  _borrowers: string;
  _expiry: string;
  _feeRate: string;
  _colBalance: string;
  _lendBalance: string;
  _totalBorrowed: string;
  _paused: boolean;
};

export type VendorLendingPoolsGraphResponse = {
  data: any;
  pools: Array<VendorLendingPool>;
};

export type VendorFinancePoolV2Definition = {
  address: string;
  deployer: string;
  mintRatio: string;
  colToken: string;
  lendToken: string;
  expiry: string;
  feeRate: string;
  lendBalance: string;
  totalBorrowed: string;
};

export type VendorLendingPoolV2 = {
  id: string;
  deployer: string;
  mintRatio: string;
  colToken: string;
  lendToken: string;
  borrowers: string;
  expiry: string;
  startRate: string;
  colBalance: string;
  lendBalance: string;
  totalBorrowed: string;
  paused: boolean;
};

export type VendorLendingPoolsV2GraphResponse = {
  [x: string]: any;
  pools: Array<VendorLendingPoolV2>;
};
