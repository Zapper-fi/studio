import { gql } from 'graphql-request';

export type BondHolders = {
  bonds: {
    id: string;
    clearingPrice: number;
    decimals: any;
    maxSupply: any;
    name: any;
    symbol: any;
    maturityDate: any;
    collateralToken: {
      id: string;
      decimals: number;
    };
    tokenBalances: {
      //   id: string;
      account: {
        id: string;
      };
      amount: string;
      bond: {
        id: string;
        name: string;
        symbol: string;
        decimals: string;
      };
    };
  }[];
};

export const BONDS_QUERY = gql`
  {
    bonds {
      id
      name
      symbol
      decimals
      maxSupply
      name
      symbol
      maturityDate
      clearingPrice
      collateralToken {
        id
        decimals
      }
    }
  }
`;
