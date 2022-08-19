export type AuraBaseRewardPoolDataProps = {
  extraRewards: { address: string; rewardToken: string }[];
  rewardToken: string;
};

export type BalancerPool = {
  id: string;
  address: string;
  name: string;
  poolType: string;
  swapFee: number;
  symbol: string;
  tokensList: string;
  totalLiquidity: number;
  totalSwapVolume: number;
  totalSwapFee: number;
  totalShares: number;
  tokens: {
    address: string;
    symbol: string;
    decimals: number;
    balance: number;
    weight: number;
  }[];
};
