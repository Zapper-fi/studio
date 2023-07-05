import { BigNumber } from 'ethers';

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
