import { BigNumberish } from 'ethers';

export type KyberswapElasticLiquidityPositionContractData = {
  nonce: BigNumberish;
  operator: string;
  token0: string;
  token1: string;
  tickLower: number;
  tickUpper: number;
  liquidity: BigNumberish;
  fee: number;
  feeGrowthInsideLast: BigNumberish;
  rTokenOwed: BigNumberish;
  poolId: BigNumberish;
};

export type KyberswapElasticPoolStateData = {
  sqrtPriceX96: BigNumberish;
  reinvestL: BigNumberish;
  currentTick: number;
  liquidity: BigNumberish;
};

export type KyberswapElasticPoolStats = {
  tvl: number;
  feesUSD: number;
};
