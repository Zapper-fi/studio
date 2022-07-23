import { gql } from 'graphql-request';

export const GET_PAIRS = gql`
  query getAvailablePairs($first: Int, $lastId: String) {
    pairs(first: $first, where: { id_gt: $lastId }) {
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
