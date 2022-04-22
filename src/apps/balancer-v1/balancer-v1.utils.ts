import { gql } from 'graphql-request';

import { TheGraphHelper } from '~app-toolkit/helpers/the-graph/the-graph.helper';

type GetAllPoolsData = {
  pools: {
    id: string;
    finalized: boolean;
    liquidity: string;
    swapFee: string;
    swaps: {
      poolTotalSwapVolume: string;
    }[];
    swapsCount: string;
    tokens: {
      address: string;
      balance: string;
      decimals: number;
      denormWeight: string;
      id: string;
      symbol: string;
    }[];
    tokensList: string[];
    totalShares: string;
    totalSwapVolume: string;
    totalWeight: string;
  }[];
};

export const getAllPoolsData = (tsYesterday: number, graphHelper: TheGraphHelper) => {
  const getPoolsQuery = gql`
    query getPools($tsYesterday: Int) {
      pools(first: 1000, orderBy: liquidity, orderDirection: desc, where: { active: true, liquidity_gte: 10000 }) {
        id
        finalized
        totalWeight
        tokensList
        totalShares
        swapsCount
        liquidity
        swapFee
        totalSwapVolume
        swaps(first: 1, orderBy: "timestamp", orderDirection: "desc", where: { timestamp_lte: $tsYesterday }) {
          poolTotalSwapVolume
        }
        liquidity
        tokens {
          id
          address
          decimals
          balance
          symbol
          denormWeight
        }
      }
    }
  `;

  return graphHelper.requestGraph<GetAllPoolsData>({
    endpoint: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
    query: getPoolsQuery,
    variables: { tsYesterday },
  });
};
