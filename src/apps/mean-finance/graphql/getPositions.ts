import { gql } from 'graphql-request';

export const GET_POSITIONS = gql`
  query getPositions($first: Int, $skip: Int) {
    positions(
      where: {
        orderDirection: desc
        orderBy: createdAtTimestamp
        first: $first,
        skip: $skip,
        status_in: [ACTIVE, COMPLETED],
      }
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
