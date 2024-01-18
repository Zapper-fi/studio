import { gql } from 'graphql-request';

export const SPOOL_ADDRESS = '0x40803cea2b2a32bda1be61d3604af6a814e70976';
export const VOSPOOL_ADDRESS = '0xaf56d16a7fe479f2fcd48ff567ff589cb2d2a0e9';
export const STAKING_ADDRESS = '0xc3160c5cc63b6116dd182faa8393d3ad9313e213';
export const SUBGRAPH_API_BASE_URL = 'https://api.studio.thegraph.com/query/41372/spool-v2_mainnet/version/latest';
export const SUBGRAPH_V1_API_BASE_URL = 'https://api.thegraph.com/subgraphs/name/spoolfi/spool?source=zapper';
export const SPOOL_LENS_ADDRESS = '0x8aa6174333f75421903b2b5c70ddf8da5d84f74f';
export const STRATEGY_REGISTRY_ADDRESS = '0x554c6bcb54656390aca0a0af38ca954dbe653f15';
export const APY_DECIMALS = '18';

export const SPOOL_STAKED_QUERY = gql`
  query getStaking($address: String!) {
    userSpoolStaking(id: $address) {
      id
      spoolStaked
    }
  }
`;

export const REWARDS_QUERY = gql`
  query {
    smartVaultRewardTokens {
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

export const VAULTS_AND_STRATEGIES_QUERY = gql`
  {
    smartVaults {
      id
      smartVaultStrategies {
        id
        isRemoved
        strategy {
          id
        }
      }
    }
  }
`;

export const ASSET_GROUPS_QUERY = gql`
  {
    smartVaults {
      assetGroup {
        id
        assetGroupTokens {
          token {
            id
            decimals
          }
        }
      }
    }
  }
`;

export const STRATEGY_ALLOCATION_QUERY = gql`
  {
    smartVaults {
      id
      smartVaultStrategies {
        id
        allocation
        isRemoved
        strategy {
          id
        }
      }
    }
  }
`;

export const GLOBAL_FEES_QUERY = gql`
  {
    globals {
      treasuryFee
      ecosystemFee
    }
  }
`;

export const FEES_QUERY = gql`
  {
    smartVaults {
      id
      smartVaultFees {
        performanceFeePercentage
        depositFeePercentage
        managementFeePercentage
      }
    }
  }
`;

export const DEPOSITS_QUERY = gql`
  {
    smartVaults {
      smartVaultFlushes {
        SmartVaultWithdrawalNFTs {
          svtWithdrawn
        }
        id
        isExecuted
        strategyDHWs {
          isExecuted
          id
        }
      }
    }
  }
`;

export const REWARDS_APY_QUERY = gql`
  query ($now: String!) {
    smartVaults {
      smartVaultRewardTokens(where: { endTime_gt: $now }) {
        id
        rewardRate
        token {
          decimals
          id
        }
      }
      id
    }
  }
`;

export const USER_NFTS_QUERY = gql`
  query ($address: String!, $smartVault: String!) {
    user(id: $address) {
      id
      smartVaultDepositNFTs(where: { smartVault: $smartVault }) {
        smartVault {
          id
        }
        nftId
      }
    }
  }
`;

export const VAULTS_QUERY = gql`
  query {
    smartVaults {
      id
      assetGroup {
        assetGroupTokens {
          token {
            id
          }
        }
      }
      id
      name
      riskTolerance
      riskProvider {
        id
      }
      smartVaultFees {
        id
        depositFeePercentage
        managementFeePercentage
        performanceFeePercentage
      }
      smartVaultStrategies {
        id
        isRemoved
        allocation
        strategy {
          id
          riskScores {
            riskScore
            riskProvider {
              id
            }
          }
        }
      }
      smartVaultRewardTokens {
        id
        token {
          id
          name
          symbol
          decimals
        }
        rewardRate
        startTime
        endTime
        totalAmount
        isRemoved
      }
    }
  }
`;
