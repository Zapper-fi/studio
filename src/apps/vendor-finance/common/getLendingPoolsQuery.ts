import { gql } from 'graphql-request';

type VendorLendingPool = {
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

type VendorLendingPoolV2 = {
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

export type VendorLendingPoolsGraphResponse = {
  pools: Array<VendorLendingPool>;
};

export type VendorLendingPoolsV2GraphResponse = {
  pools: Array<VendorLendingPoolV2>;
};

export const LENDING_POOLS_QUERY = gql`
  query getPoolsList {
    pools(first: 1000, where: { _expiry_gt: ${`${Math.floor(new Date().getTime() / 1000)}`} }) {
      id
      _deployer
      _mintRatio
      _colToken
      _lendToken
      _borrowers
      _expiry
      _feeRate
      _colBalance
      _lendBalance
      _totalBorrowed
      _paused
    }
  }
`;

export const LENDING_POOLS_V2_QUERY = gql`
  query getPoolsList {
    pools(first: 1000, where: { expiry_gt: ${`${Math.floor(new Date().getTime() / 1000)}`} }) {
      id
      deployer
      mintRatio
      colToken
      lendToken
      borrowers
      expiry
      startRate
      colBalance
      lendBalance
      totalBorrowed
      paused
    }
  }
`;
