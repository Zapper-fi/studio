import { BigNumberish } from 'ethers';

export type UniswapV3LiquidityPositionContractData = {
  nonce: BigNumberish;
  operator: string;
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: BigNumberish;
  feeGrowthInside0LastX128: BigNumberish;
  feeGrowthInside1LastX128: BigNumberish;
  tokensOwed0: BigNumberish;
  tokensOwed1: BigNumberish;
};

export type UniswapV3LiquiditySlotContractData = {
  sqrtPriceX96: BigNumberish;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
};

export type UniswapV3LiquidityTickContractData = {
  liquidityGross: BigNumberish;
  liquidityNet: BigNumberish;
  feeGrowthOutside0X128: BigNumberish;
  feeGrowthOutside1X128: BigNumberish;
};
