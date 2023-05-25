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
  pools: Array<VendorLendingPool>;
};

// Used for V1 Pools
export type BorrowerPosition = {
  pool: {
    id: string;
    _mintRatio: string;
  };
  totalBorrowed: string;
  effectiveRate: string;
};

export type VendorBorrower = {
  positions: Array<BorrowerPosition>;
};

export type VendorBorrowerGraphResponse = {
  borrower: VendorBorrower;
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
  pools: Array<VendorLendingPoolV2>;
};
