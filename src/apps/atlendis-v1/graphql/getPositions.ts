import { gql } from 'graphql-request';

export type GetUserPositionsResponse = {
  positions: {
    id: string;
    pool: {
      parameters: {
        underlyingToken: string;
      };
    };
  }[];
};

export const GET_USER_POSITIONS = gql`
  query getUserPositions($address: String!) {
    positions(where: { lender: $address }) {
      id
      pool {
        parameters {
          underlyingToken
        }
      }
    }
  }
`;
