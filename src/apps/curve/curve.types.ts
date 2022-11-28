export enum CurvePoolType {
  STABLE = 'stable',
  CRYPTO = 'crypto',
  FACTORY_STABLE = 'factory-stable',
  FACTORY_CRYPTO = 'factory-crypto',
}

export type CurvePoolDefinition = {
  swapAddress: string;
  tokenAddress: string;
  coinAddresses?: string[];
  gaugeAddresses?: string[];
  poolType?: CurvePoolType;
  volume?: number;
  apy?: number;
  isLegacy?: boolean;
};
