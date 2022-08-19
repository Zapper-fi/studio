import { gql } from 'graphql-request';

type AccountBalance = {
  id: string;
  token: string;
  account: string;
  balance: string;
};

export type CompoundorAccountBalances = {
  accountBalances: Array<AccountBalance>;
};

export const accountBalancesQuery = gql`
  query getAccountBalances($address: String) {
    accountBalances(where: { account: $address }) {
      id
      account
      token
      balance
    }
  }
`;
