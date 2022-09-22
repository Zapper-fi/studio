export type MyceliumPoolToken = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export interface MyceliumPoolsApiResponse {
  name: string;
  timestamp: number;
  pools: Array<MyceliumPoolsApiDatas>;
}

export interface MyceliumPoolsApiDatas {
  name: string;
  address: string;
  leverage: number;
  updateInterval: number;
  frontRunningInterval: number;
  keeper: string;
  committer: {
    address: string;
  };
  longToken: MyceliumPoolToken;
  shortToken: MyceliumPoolToken;
  settlementToken: MyceliumPoolToken;
}

export interface MyceliumPoolInfosApiResponse {
  currentSkew: string;
  currentLongBalance: string;
  currentLongSupply: string;
  currentShortBalance: string;
  currentShortSupply: string;
  expectedSkew: string;
  expectedLongBalance: string;
  expectedLongSupply: string;
  expectedShortBalance: string;
  expectedShortSupply: string;
  totalNetPendingLong: string;
  totalNetPendingShort: string;
  expectedLongTokenPrice: string;
  expectedShortTokenPrice: string;
  lastOraclePrice: string;
  expectedOraclePrice: string;
  expectedFrontRunningSkew: string;
  expectedFrontRunningLongBalance: string;
  expectedFrontRunningLongSupply: string;
  expectedFrontRunningShortBalance: string;
  expectedFrontRunningShortSupply: string;
  totalNetFrontRunningPendingLong: string;
  totalNetFrontRunningPendingShort: string;
  expectedFrontRunningLongTokenPrice: string;
  expectedFrontRunningShortTokenPrice: string;
  expectedFrontRunningOraclePrice: string;
}

export interface MyceliumPoolPrices {
  longTokenPrice: number;
  shortTokenPrice: number;
}

export type PerpPoolFarm = {
  address: string;
  pool: string;
  name?: string;
  isBPTFarm?: boolean;
  balancerPoolId?: string;
  link?: string;
  rewardsEnded?: boolean;
  type?: 'short' | 'long';
};
