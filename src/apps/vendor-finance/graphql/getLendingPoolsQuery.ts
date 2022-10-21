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

export type VendorLendingPoolsGraphResponse = {
  pools: Array<VendorLendingPool>;
};

export const lendingPoolsQuery = gql`
  query getPoolsList {
    pools(first: 1000, where: { _lendBalance_gt: "0", _expiry_gt: ${`${Math.floor(new Date().getTime() / 1000)}`} }) {
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
