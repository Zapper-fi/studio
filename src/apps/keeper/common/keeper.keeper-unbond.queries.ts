import { gql } from 'graphql-request';

export const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/0xged/keep3r-v2-canary?source=zapper';

export type KeeperUnbond = {
  bonds: {
    pendingUnbonds: string;
    withdrawableAfter;
    token: {
      id: string;
      name: string;
      symbol: string;
      decimals: string;
    };
    keeper: {
      id: string;
    };
  }[];
};

export const GET_UNBONDS = gql`
  query getUnbonds($first: Int, $lastId: String) {
    bonds(where: { pendingUnbonds_gt: 0, id_gt: $lastId }, first: $first) {
      id
      keeper {
        id
      }
      pendingUnbonds
      withdrawableAfter
      token {
        id
        name
        symbol
        decimals
      }
    }
  }
`;

export const GET_USER_UNBONDS = gql`
  query getUserUnbonds($address: String!, $first: Int, $lastId: String) {
    bonds(where: { pendingUnbonds_gt: 0, keeper: $address, id_gt: $lastId }, first: $first) {
      id
      keeper {
        id
      }
      pendingUnbonds
      withdrawableAfter
      token {
        id
        name
        symbol
        decimals
      }
    }
  }
`;
