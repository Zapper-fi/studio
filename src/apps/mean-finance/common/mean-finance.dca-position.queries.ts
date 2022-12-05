import { gql } from 'graphql-request';

export type MeanFinancePosition = {
  positions: {
    id: string;
    totalExecutedSwaps: string;
    user: string;
    from: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
      underlyingTokens: {
        address: string;
        decimals: string;
        name: string;
        symbol: string;
      }[];
    };
    to: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
      underlyingTokens: {
        address: string;
        decimals: string;
        name: string;
        symbol: string;
      }[];
    };
    status: string;
    swapInterval: {
      id: string;
      interval: string;
    };
    rate: string;
    remainingSwaps: string;
    remainingLiquidity: string;
    depositedRateUnderlying: string;
    toWithdrawUnderlyingAccum: string;
    toWithdraw: string;
  }[];
};

export const GET_POSITIONS = gql`
  query getPositions($first: Int, $lastId: String) {
    positions(where: { status_in: [ACTIVE, COMPLETED], id_gt: $lastId }, first: $first) {
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
