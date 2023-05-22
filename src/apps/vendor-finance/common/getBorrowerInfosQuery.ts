import { gql } from 'graphql-request';

// Used for V1 Pools
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

// Used for V2 Pools
type BorrowersV2Position = {
  pool: {
    id: string;
    mintRatio: string;
  };
  totalBorrowed: string;
  effectiveRate: string;
};

type VendorBorrowerV2 = {
  positions: Array<BorrowersV2Position>;
};

export type VendorBorrowerV2GraphResponse = {
  borrower: VendorBorrowerV2;
};

export const borrowerV2InfosQuery = (address: string) => gql`
  {
    borrowers(id: "${address}") {
      positions {
        pool {
          id
          mintRatio
        }
        totalBorrowed
        effectiveRate
      }
    }
  }
`;
