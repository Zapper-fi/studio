export enum CurvePoolType {
  STABLE = 'stable',
  CRYPTO = 'crypto',
  FACTORY_STABLE = 'factory-stable',
  FACTORY_CRYPTO = 'factory-crypto',
}

export type CurvePoolDefinition = {
  swapAddress: string;
  tokenAddress: string;
  coinAddresses: string[];
  gaugeAddresses?: string[];
  poolType?: CurvePoolType;
  isMetaPool?: boolean;
  volume?: number;
  apy?: number;
  isLegacy?: boolean;
};

export enum CurveGaugeType {
  SINGLE = 'single',
  DOUBLE = 'double',
  N_GAUGE = 'n-gauge',
  GAUGE_V4 = 'gauge-v4',
  CHILD = 'child-chain',
  REWARDS_ONLY = 'rewards-only',
}

export type CurveGaugeDefinition = {
  version: CurveGaugeType;
  swapAddress: string;
  gaugeAddress: string;
};
