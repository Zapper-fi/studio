import { gql } from 'graphql-request';

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
