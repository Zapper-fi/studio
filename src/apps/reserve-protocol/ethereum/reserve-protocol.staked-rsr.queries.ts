import { gql } from 'graphql-request';

const minValidSupply = 10 ** 18;

export type RTokens = {
  tokens: {
    id: string;
    lastPriceUSD: string;
    name: string;
    symbol: string;
    totalSupply: string;
    holderCount: string;
    transferCount: string;
    cumulativeVolume: string;
    rToken: {
      rewardToken: {
        token: { id: string };
      };
      backing: string;
      backingInsurance: string;
      targetUnits: string;
      recentRate: {
        rsrExchangeRate: string;
        basketRate: string;
        timestamp: string;
      };
      lastRate: {
        rsrExchangeRate: string;
        basketRate: string;
        timestamp: string;
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
      lastPriceUSD
      name
      symbol
      totalSupply
      holderCount
      transferCount
      cumulativeVolume
      rToken {
        rewardToken {
          token {
            id
          }
        }
        backing
        backingInsurance
        targetUnits
        recentRate: hourlySnapshots(first: 1, orderBy: timestamp, orderDirection: desc) {
          rsrExchangeRate
          basketRate
          timestamp
        }
        lastRate: hourlySnapshots(first: 1, orderBy: timestamp, orderDirection: asc) {
          rsrExchangeRate
          basketRate
          timestamp
        }
      }
    }
  }
`;
