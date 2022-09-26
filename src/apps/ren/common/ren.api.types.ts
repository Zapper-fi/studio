import { gql } from 'graphql-request';

export type GetDarknodesResponse = {
  darknodes?: {
    bond: string;
    registeredAt: string;
    balances: {
      symbol: string;
      amount: string;
      amountInUsd: string;
      asset?: {
        tokenAddress: string;
      };
    }[];
  }[];
};

export type GetAssetsResponse = {
  assets: {
    tokenAddress: string;
  }[];
};

export const GET_DARKNODES_QUERY = gql`
  query getBalance($address: String!) {
    darknodes(where: { operator: $address }) {
      bond
      registeredAt
      balances {
        symbol
        amount
        amountInUsd
        asset {
          tokenAddress
        }
      }
    }
  }
`;

export const GET_ASSETS_QUERY = gql`
  query getAssets {
    assets {
      tokenAddress
    }
  }
`;
