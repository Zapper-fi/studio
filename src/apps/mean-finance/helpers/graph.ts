import { gql } from 'graphql-request';

import { TheGraphHelper } from '~app-toolkit/helpers/the-graph/the-graph.helper';

type MeanFinancePosition = {
  positions: {
    id: string;
    executedSwaps: string;
    user: string;
    from: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
    to: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
    status: string;
    swapInterval: {
      id: string;
      interval: string;
    };
    current: {
      id: string;
      rate: string;
      remainingSwaps: string;
      remainingLiquidity: string;
      idleSwapped: string;
    };
  }[];
};

export const getCurrentPositions = (address: string, network: string, graphHelper: TheGraphHelper) => {
  const query = gql`
    query getCurrentPositions($address: String!) {
      positions(where: { user: $address, status_in: [ACTIVE, COMPLETED] }) {
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

  return graphHelper.requestGraph<MeanFinancePosition>({
    endpoint: `https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-${network}`,
    query: query,
    variables: { address },
  });
};

type MeanFinancePair = {
  pairs: {
    id: string;
    tokenA: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
    tokenB: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
  }[];
};

export const getPairs = (network: string, graphHelper: TheGraphHelper) => {
  const query = gql`
    query getAvailablePairs {
      pairs(first: 1000) {
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

  return graphHelper.requestGraph<MeanFinancePair>({
    endpoint: `https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-${network}`,
    query: query,
  });
};
