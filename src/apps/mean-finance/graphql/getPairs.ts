import { gql } from 'graphql-request';

export const GET_PAIRS = gql`
  query getAvailablePairs {
    pairs(
      first: $first,
      skip: $skip,
      orderDirection: desc,
      orderBy: createdAtTimestamp,
    ) {
      id
      tokenA {
        address: id
        decimals
        name
        symbol
      }
      tokenB {
        address: id
        decimals
        name
        symbol
      }
    }
  }
`;
