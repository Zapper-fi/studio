import { gql } from 'graphql-request';

//unipilot vaults
export const UNIPILOT_VAULTS = gql`
  query getVaults($first: Int!) {
    vaults {
      id
      feeTier
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      totalLockedToken0
      totalLockedToken1
      fee0Uninvested
      fee1Uninvested
      fee0invested
      fee1invested
    }
  }
`;

//unipilot vaults for polygon
export const UNIPILOT_VAULTS_POLYGON = gql`
  query getVaults($first: Int!) {
    vaults {
      id
      feeTier
      strategyId
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      totalLockedToken0
      totalLockedToken1
      fee0Uninvested
      fee1Uninvested
      fee0invested
      fee1invested
    }
  }
`;

//unipilot vault addresses for apy
export const VAULT_ADDRESSES = gql`
  query getAddresses {
    vaults(first: 1000) {
      id
    }
  }
`;
