import { gql } from 'graphql-request';

const minValidSupply = 10 ** 18;

export type RTokens = {
  tokens: {
    id: string;
    rToken: {
      rewardToken: {
        token: { id: string };
      };
    };
  }[];
};

export const getRTokens = gql`
  query getRTokens {
    tokens(
      where: { totalSupply_gt: ${minValidSupply}, symbol_not: "RSV" }
      orderBy: totalSupply
      orderDirection: desc
    ) {
      id
      rToken {
        rewardToken {
          token {
            id
          }
        }
      }
    }
  }
`;
