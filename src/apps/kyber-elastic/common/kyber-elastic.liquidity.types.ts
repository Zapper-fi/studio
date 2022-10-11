import { BigNumber } from 'ethers';

export type KyberElasticLiquidityPositionContractData = {
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

export type KyberElasticPoolStateData = {
  sqrtPriceX96: BigNumber;
  reinvestL: BigNumber;
  currentTick: number;
  liquidity: BigNumber;
};
