import { gql } from 'graphql-request';

export const SPOOL_ADDRESS = '0x40803cea2b2a32bda1be61d3604af6a814e70976';
export const VOSPOOL_ADDRESS = '0xaf56d16a7fe479f2fcd48ff567ff589cb2d2a0e9';
export const STAKING_ADDRESS = '0xc3160c5cc63b6116dd182faa8393d3ad9313e213';
export const SUBGRAPH_API_BASE_URL = 'https://api.thegraph.com/subgraphs/name/spoolfi/spool?source=zapper';
export const ANALYTICS_API_BASE_URL = 'https://analytics.spool.fi';

export const REWARDS_QUERY = gql`
  query {
    stakingRewardTokens {
      id
      token {
        id
        name
        symbol
        decimals
      }
      isRemoved
      endTime
      startTime
    }
  }
`;

export const SPOOL_STAKED_QUERY = gql`
  query getStaking($address: String!) {
    userSpoolStaking(id: $address) {
      id
      spoolStaked
    }
  }
`;
