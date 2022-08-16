import { gql } from 'graphql-request';

type AccountTokens = {
  id: string;
  account: string;
  compoundCount: string;
  compounded0: string;
};

export type CompoundingAccountTokens = {
  tokens: Array<AccountTokens>;
};

export const accountCompoundingTokensQuery = gql`
  query getAccountCompoundingTokens($address: String) {
    tokens(where: { account: $address }) {
      id
      account
      compoundCount
      compounded0
    }
  }
`;
