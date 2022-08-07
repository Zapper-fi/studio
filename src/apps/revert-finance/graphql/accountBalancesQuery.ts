import { gql } from 'graphql-request';

type AccountBalance = {
  id: string;
  token: string;
  account: string;
  balance: string;
};

export type CompoundorUserPosition = {
  accountBalances: Array<AccountBalance>;
};

export const accountBalancesQuery = gql`
  query getUserPositions($address: String!) {
    accountBalances(where: { account: $address }) {
      id
      account
      token
      balance
    }
  }
`;
