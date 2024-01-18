import { BigNumber } from 'ethers';

export type SpoolVaults = {
  smartVaults: VaultDetails[];
};

export type VaultDetails = {
  id: string;
  name: string;
  riskTolerance: string;
  riskProvider: {
    id: string;
  };
  assetGroup: {
    assetGroupTokens: {
      token: {
        id: string;
      };
    }[];
  };
  smartVaultFees: {
    depositFeePercentage: string;
    managementFeePercentage: string;
    performanceFeePercentage: string;
  };
  smartVaultStrategies: {
    id: string;
    allocation: string;
    isRemoved: boolean;
    strategy: {
      id: string;
      riskScores: {
        riskScore: string;
        riskProvider: {
          id: string;
        };
      }[];
    };
  }[];
  smartVaultRewardTokens: {
    id: string;
    token: {
      id: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    rewardRate: number;
    totalAmount: string;
    isRemoved: number;
  }[];
};

export type Globals = {
  globals: {
    treasuryFee: string;
    ecosystemFee: string;
  };
};

export type VaultsAnalytics = {
  smartVaults: {
    id: string;
    tvr: string;
    tvrUsd: string;
    baseApy: string;
    rewardsApy: string[];
    adjustedApy: string;
    vaultAssets: BigNumber[];
  }[];
};

export type StakingReward = {
  stakingRewardTokens: {
    id: string;
    token: {
      id: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    isRemoved: boolean;
    endTime: string;
    startTime: string;
  }[];
};

export type UserSpoolStaking = {
  userSpoolStaking: {
    id: string;
    spoolStaked: string;
  };
};

export interface RewardApyReturnType {
  vaultId: string;
  rewardTokens: {
    id: string;
    rewardRate: string;
    decimals: number;
    apy: string;
  }[];
}
export interface SmartVaultRewards {
  smartVaultRewardTokens: RewardToken[];
  id: string;
}

interface RewardToken {
  id: string;
  rewardRate: string;
  token: {
    decimals: number;
    id: string;
  };
}

export type rewardsApyQueryData = {
  smartVaults: {
    smartVaultRewardTokens: {
      id: string;
      rewardRate: string;
      token: {
        decimals: number;
        id: string;
      };
    }[];
    id: string;
  }[];
};

export type userNftQueryData = {
  user: {
    id: string;
    smartVaultDepositNFTs: {
      smartVault: {
        id: string;
      };
      nftId: string;
    }[];
  };
};

export type SpoolVaultDefinition = {
  address: string;
  name: string;
  riskModel: string;
  suppliedTokenAddresses: string[];
  rewardTokenAddresses: string[] | null;
  strategyAddresses: string[];
  stats: {
    riskTolerance: number;
    tvr: string;
    tvrUsd: string;
    fees: number;
    adjustedApy: number;
    rewardsApy: string[];
    baseApy: number;
    vaultAssets: string[];
  };
};

export type SpoolVaultDataProps = {
  totalValueRoutedUsd: string;
  baseApy: number;
  adjustedApy: number;
  totalValueRoutedSvt: string;
  rewardsApy: string[];
  strategies: string[];
  riskScore: string;
  riskTolerance: number;
  vaultAssets: string[];
};

export interface TvrType {
  vault: Vault;
  tvr: BigNumber;
}

export interface vaultQueryData {
  smartVaults: {
    id: string;
    smartVaultStrategies: {
      id: string;
      isRemoved: boolean;
      strategy: {
        id: string;
      };
    }[];
  }[];
}

export interface depositsQueryData {
  smartVaults: {
    smartVaultFlushes: {
      SmartVaultWithdrawalNFTs: {
        svtWithdrawn: string;
      }[];
      id: string;
      isExecuted: boolean;
      strategyDHWs: {
        isExecuted: boolean;
        id: string;
      }[];
    }[];
  }[];
}

export interface BaseApy {
  vault: Vault;
  baseApy: string;
}

export interface RewardsApy {
  vault: Vault;
  rewardsApys: string[];
}
export interface assetGroupsData {
  smartVaults: {
    assetGroup: {
      id: string;
      assetGroupTokens: {
        token: {
          id: string;
          decimals: number;
        };
      }[];
    };
  }[];
}
export interface VaultAsset {
  vault: Vault;
  assets: BigNumber[];
}

export interface allocationData {
  smartVaults: {
    id: string;
    smartVaultStrategies: {
      id: string;
      allocation: string;
      isRemoved: boolean;
      strategy: {
        id: string;
      };
    }[];
  }[];
}
export interface AdjustedApy {
  vault: Vault;
  adjustedApy: string;
}
export interface TokenPrice {
  token: string;
  price: string;
}
export interface globalFeesData {
  globals: {
    treasuryFee: string;
    ecosystemFee: string;
  }[];
}
export interface feesData {
  smartVaults: {
    id: string;
    smartVaultFees: {
      performanceFeePercentage: string;
      depositFeePercentage: string;
      managementFeePercentage: string;
    };
  }[];
}
export interface TvrUsd {
  vault: Vault;
  tvrUsd: string;
}

export interface StrategyAllocation {
  vault: Vault;
  strategies: Strategy[];
  allocations: string[];
}

export interface Strategy {
  id: string;
}

export interface Vault {
  id: string;
  strategies: Strategy[];
}
