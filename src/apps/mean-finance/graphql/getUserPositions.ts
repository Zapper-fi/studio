import { gql } from 'graphql-request';

export const GET_USER_POSITIONS = gql`
  query getUserPositions($address: String!, $first: Int, $lastId: String) {
    positions(where: { user: $address, status_in: [ACTIVE, COMPLETED], id_gt: $lastId }, first: $first) {
      id
      totalExecutedSwaps
      user
      from {
        address: id
        decimals
        name
        symbol
        underlyingTokens {
          address: id
          decimals
          name
          symbol
          type
        }
      }
      to {
        address: id
        decimals
        name
        symbol
        underlyingTokens {
          address: id
          decimals
          name
          symbol
          type
        }
      }
      status
      swapInterval {
        interval
      }
      rate
      depositedRateUnderlying
      remainingSwaps
      remainingLiquidity
      toWithdraw
      toWithdrawUnderlyingAccum
    }
  }
`;
