import { Token as TokenWrapper } from '@uniswap/sdk-core';
import { Pool, Position } from '@uniswap/v3-sdk';
import { BigNumber } from 'ethers';

import { Token } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types';

import {
  UniswapV3LiquidityPositionContractData,
  UniswapV3LiquiditySlotContractData,
  UniswapV3LiquidityTickContractData,
} from './uniswap-v3.liquidity.types';

function subIn256(x: BigNumber, y: BigNumber): BigNumber {
  const difference = x.sub(y);
  return difference.lt(0) ? BigNumber.from(2).pow(256).add(difference) : difference;
}

const getCounterfactualFees = (
  liquidity: BigNumber,
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  feeGrowthGlobal: BigNumber,
  feeGrowthOutsideLower: BigNumber,
  feeGrowthOutsideUpper: BigNumber,
  feeGrowthInsideLast: BigNumber,
) => {
  const feeGrowthBelow = BigNumber.from(tickCurrent).gte(tickLower)
    ? BigNumber.from(feeGrowthOutsideLower)
    : subIn256(BigNumber.from(feeGrowthGlobal), BigNumber.from(feeGrowthOutsideLower));
  const feeGrowthAbove = BigNumber.from(tickCurrent).lt(tickUpper)
    ? BigNumber.from(feeGrowthOutsideUpper)
    : subIn256(BigNumber.from(feeGrowthGlobal), BigNumber.from(feeGrowthOutsideUpper));
  const feeGrowthInside = subIn256(
    subIn256(BigNumber.from(feeGrowthGlobal), BigNumber.from(feeGrowthBelow)),
    BigNumber.from(feeGrowthAbove),
  );

  return subIn256(feeGrowthInside, BigNumber.from(feeGrowthInsideLast))
    .mul(liquidity)
    .div(BigNumber.from(2).pow(128))
    .toString();
};

export const getSupplied = ({
  position,
  slot,
  token0,
  token1,
  network,
  liquidity,
}: {
  position: UniswapV3LiquidityPositionContractData;
  slot: UniswapV3LiquiditySlotContractData;
  token0: Token;
  token1: Token;
  network: Network;
  liquidity: BigNumber;
}) => {
  const tickLower = Number(position.tickLower);
  const tickUpper = Number(position.tickUpper);
  const feeBips = Number(position.fee);

  const networkId = NETWORK_IDS[network]!;
  const t0 = new TokenWrapper(networkId, token0.address, token0.decimals, token0.symbol);
  const t1 = new TokenWrapper(networkId, token1.address, token1.decimals, token1.symbol);
  const pool = new Pool(t0, t1, feeBips, slot.sqrtPriceX96.toString(), liquidity.toString(), Number(slot.tick));
  const pos = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });

  const token0BalanceRaw = pos.amount0.multiply(10 ** token0.decimals).toFixed(0);
  const token1BalanceRaw = pos.amount1.multiply(10 ** token1.decimals).toFixed(0);
  return [token0BalanceRaw, token1BalanceRaw];
};

export const getClaimable = ({
  position,
  slot,
  ticksLower,
  ticksUpper,
  feeGrowth0,
  feeGrowth1,
}: {
  position: UniswapV3LiquidityPositionContractData;
  slot: UniswapV3LiquiditySlotContractData;
  ticksLower: UniswapV3LiquidityTickContractData;
  ticksUpper: UniswapV3LiquidityTickContractData;
  feeGrowth0: BigNumber;
  feeGrowth1: BigNumber;
}) => {
  const counterfactualFees0 = getCounterfactualFees(
    position.liquidity,
    slot.tick,
    position.tickLower,
    position.tickUpper,
    feeGrowth0,
    ticksLower.feeGrowthOutside0X128,
    ticksUpper.feeGrowthOutside0X128,
    position.feeGrowthInside0LastX128,
  );

  const counterfactualFees1 = getCounterfactualFees(
    position.liquidity,
    slot.tick,
    position.tickLower,
    position.tickUpper,
    feeGrowth1,
    ticksLower.feeGrowthOutside1X128,
    ticksUpper.feeGrowthOutside1X128,
    position.feeGrowthInside1LastX128,
  );

  const token0ClaimableBalanceRaw = BigNumber.from(position.tokensOwed0).add(counterfactualFees0).toString();
  const token1ClaimableBalanceRaw = BigNumber.from(position.tokensOwed1).add(counterfactualFees1).toString();
  return [token0ClaimableBalanceRaw, token1ClaimableBalanceRaw];
};

export const getRange = ({
  position,
  slot,
  token0,
  token1,
  network,
  liquidity,
}: {
  position: UniswapV3LiquidityPositionContractData;
  slot: UniswapV3LiquiditySlotContractData;
  token0: Token;
  token1: Token;
  network: Network;
  liquidity: BigNumber;
}) => {
  const sqrtPriceX96 = slot.sqrtPriceX96; // sqrt(token1/token0) Q64.96 value
  const tickCurrent = Number(slot.tick);

  const tickLower = Number(position.tickLower);
  const tickUpper = Number(position.tickUpper);
  const feeBips = Number(position.fee);

  const networkId = NETWORK_IDS[network]!;
  const t0Wrapper = new TokenWrapper(networkId, token0.address, token0.decimals, token0.symbol);
  const t1Wrapper = new TokenWrapper(networkId, token1.address, token1.decimals, token1.symbol);
  const pool = new Pool(t0Wrapper, t1Wrapper, feeBips, sqrtPriceX96.toString(), liquidity.toString(), tickCurrent);
  const positionZ = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });

  const positionLowerBound = Number(positionZ.token0PriceLower.toFixed(4));
  const positionUpperBound = Number(positionZ.token0PriceUpper.toFixed(4));
  return [positionLowerBound, positionUpperBound];
};
