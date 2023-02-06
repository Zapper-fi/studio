import { gql } from 'graphql-request';

export const GET_DEPOSIT = gql`
  query getSiloBalance($token: String, $account: ID!) {
    farmer(id: $account) {
      # Deposited
      deposited: deposits(orderBy: season, orderDirection: asc, where: { token: $token, amount_gt: 0 }) {
        amount
      }
      # Withdrawn
      withdrawn: withdraws(orderBy: withdrawSeason, orderDirection: asc, where: { token: $token, claimed: false }) {
        amount
      }
    }
  }
`;
