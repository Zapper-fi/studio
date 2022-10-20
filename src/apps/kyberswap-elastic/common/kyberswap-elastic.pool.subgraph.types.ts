import { gql } from 'graphql-request';

export const POOLs_FEE_HISTORY = gql`
  query poolFees($block: Int!) {
    pools(block: { number: $block }) {
      id
      feesUSD
    }
  }
`;

export const GET_BLOCKS = (timestamps: number[]) => {
  let queryString = 'query blocks {';
  queryString += timestamps.map(timestamp => {
    return `blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
      number
    }`;
  });
  queryString += '}';
  return gql`
    ${queryString}
  `;
};

export const GET_TOP_POOLS_QUERY = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
      }
      token1 {
        id
      }
    }
  }
`;

export const GET_POOL_INFO = gql`
  query poolInfo($id: String!) {
    pool(id: $id) {
      id
      feesUSD
      totalValueLockedUSD
    }
  }
`;
