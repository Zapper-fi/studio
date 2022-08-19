import { gql } from 'graphql-request';

export const GET_POSITIONS = gql`
  query getPositions($first: Int, $lastId: String) {
    positions(where: { status_in: [ACTIVE, COMPLETED], id_gt: $lastId }, first: $first) {
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
