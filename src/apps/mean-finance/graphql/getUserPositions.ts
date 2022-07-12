import { gql } from 'graphql-request';

export const GET_USER_POSITIONS = gql`
  query getUserPositions($address: String!, $first: Int, $skip: Int) {
    positions(
      where: { user: $address, status_in: [ACTIVE, COMPLETED] }
      first: $first
      skip: $skip
      orderDirection: desc
      orderBy: createdAtTimestamp
    ) {
      id
      executedSwaps
      user
      from {
        address: id
        decimals
        name
        symbol
      }
      to {
        address: id
        decimals
        name
        symbol
      }
      status
      swapInterval {
        interval
      }
      current {
        rate
        remainingSwaps
        remainingLiquidity
        idleSwapped
      }
    }
  }
`;
