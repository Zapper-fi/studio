import { gql } from 'graphql-request';

export type ConfigResponse = {
  configs: {
    id: string;
    lpToken: string;
    tenderToken: string;
    symbol: string;
    steak: string;
  }[];
};

export const configQuery = gql`
  {
    configs {
      id
      lpToken
      tenderToken
      symbol
      steak
    }
  }
`;

export type TenderTokenFetcherResponse = {
  configs: {
    id: string;
    tenderToken: string;
    symbol: string;
    steak: string;
  }[];
  tenderSwaps: {
    id: string;
    virtualPrice: string;
  }[];
};
export const tenderTokenFetcherQuery = gql`
  {
    configs {
      id
      tenderToken
      symbol
      steak
    }
    tenderSwaps {
      id
      virtualPrice
    }
  }
`;
