import { BigNumber } from 'ethers';

export type KyberSwapElasticLiquidityPositionContractData = {
  nonce: BigNumber;
  operator: string;
  token0: string;
  token1: string;
  tickLower: number;
  tickUpper: number;
  liquidity: BigNumber;
  fee: number;
  feeGrowthInsideLast: BigNumber;
  rTokenOwed: BigNumber;
  poolId: BigNumber;
};

export type KyberSwapElasticPoolStateData = {
  sqrtPriceX96: BigNumber;
  reinvestL: BigNumber;
  currentTick: number;
  liquidity: BigNumber;
};

export type KyberSwapElasticPoolStats = {
  tvl: number;
  feesUSD: number;
};
