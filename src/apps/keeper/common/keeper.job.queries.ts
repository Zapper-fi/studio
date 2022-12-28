import { gql } from 'graphql-request';

export const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/0xged/keep3r-v2-canary';

export type KeeperJob = {
  jobs: {
    id: string;
    liquidities: {
      id: string;
      amount: string;
      pendingUnbonds: string;
      withdrawableAfter: string;
      klp: {
        id;
      }
    }[]
    credits: {
      id: string;
      amount: string;
      token: {
        id: string;
        name: string;
        symbol: string;
        decimals: string;
      }
    }[]
    owner: string;
  }[];
};

export const GET_JOBS = gql`
  query getJobs($first: Int, $lastId: String) {
    jobs(where: { id_gt: $lastId }, first: $first) {
      id
      liquidities {
        id
        amount
        pendingUnbonds
        withdrawableAfter
        klp {
          id
        }
      }
      credits {
        id
        amount
        token {
          id
          name
          symbol
          decimals
        }
      }
      owner
    }
  }
`;

export const GET_USER_JOBS = gql`
  query getUserJobs($address: String!, $first: Int, $lastId: String) {
    jobs(where: { owner: $address, id_gt: $lastId }, first: $first) {
      id
      liquidities {
        id
        amount
        pendingUnbonds
        withdrawableAfter
      }
      credits {
        id
        amount
        token {
          id
          name
          symbol
          decimals
        }
      }
      owner
    }
  }
`;
