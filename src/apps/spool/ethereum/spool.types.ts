export type SpoolVaults = {
  spools: VaultDetails[];
};

export type VaultDetails = {
  id: string;
  name: string;
  riskTolerance: string;
  underlying: {
    id: string;
    decimals: number;
    symbol: string;
  };
  riskProvider: {
    id: string;
    feeSize: string;
  };
  fees: {
    feeSize: string;
  };
  strategies: {
    id: string;
    position: number;
    allocation: string;
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
  rewardTokens: {
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

export type RewardAnalytics = {
  [vault: string]: { [token: string]: [{ apy: string; timestamp: number }] };
};

export type StrategyAnalytics = {
  [key: string]: [{ apy: number; timestamp: number }];
};

export type VaultAnalytics = {
  [key: string]: [{ apy: number; timestamp: number; tvr: string }];
};

export type Platform = {
  platform: {
    id: string;
    treasuryFeeSize: string;
    ecosystemFeeSize: string;
  };
};
