import { gql } from 'graphql-request';

type BorrowerPosition = {
  pool: {
    id: string;
    _mintRatio: string;
  };
  totalBorrowed: string;
  effectiveRate: string;
};

type VendorBorrower = {
  positions: Array<BorrowerPosition>;
};

export type VendorBorrowerGraphResponse = {
  borrower: VendorBorrower;
};

export const borrowerInfosQuery = (address: string) => gql`
  {
    borrower(id: "${address}") {
      positions {
        pool {
          id
          _mintRatio
        }
        totalBorrowed
        effectiveRate
      }
    }
  }
`;
