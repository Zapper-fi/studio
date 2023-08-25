import { gql } from 'graphql-request';

export const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/0xged/keep3r-v2-canary?source=zapper';

export type KeeperBond = {
  bonds: {
    bonded: string;
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

export const GET_BONDS = gql`
  query getBonds($first: Int, $lastId: String) {
    bonds(where: { id_gt: $lastId }, first: $first) {
      id
      keeper {
        id
      }
      bonded
      token {
        id
        name
        symbol
        decimals
      }
    }
  }
`;

export const GET_USER_BONDS = gql`
  query getUserUnbonds($address: String!, $first: Int, $lastId: String) {
    bonds(where: { keeper: $address, id_gt: $lastId }, first: $first) {
      id
      keeper {
        id
      }
      bonded
      token {
        id
        name
        symbol
        decimals
      }
    }
  }
`;
