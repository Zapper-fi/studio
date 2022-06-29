import { gql } from 'graphql-request';

export const GET_POSITIONS = gql`
  query getPositions($first: Int, $skip: Int) {
    positions(
      where: {
        status_in: [ACTIVE, COMPLETED],
      }
      orderDirection: desc,
      orderBy: createdAtTimestamp,
      first: $first,
      skip: $skip,
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
