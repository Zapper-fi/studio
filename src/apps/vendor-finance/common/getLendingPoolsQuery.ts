export const LENDING_POOLS_QUERY = {
  query: `query {
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
`,
};

export const LENDING_POOLS_V2_QUERY = {
  query: `query {
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
`,
};
