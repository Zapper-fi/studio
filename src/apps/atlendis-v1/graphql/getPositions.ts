import { gql } from 'graphql-request';

export const GET_USER_POSITIONS = gql`
  query getUserPositions($address: String!) {
    positions(address: $address) {
      tokenId
      normalizedAmount
      pool {
        parameters {
          underlyingToken
        }
      }
    }
  }
`;
