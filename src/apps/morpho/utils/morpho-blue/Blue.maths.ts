import { MarketParams, MarketState, UserPosition } from './interfaces';

import { MulDiv, getConvertToAssets, getConvertToShares, mulDivDown, mulDivUp, pow } from 'evm-maths/lib/utils';
import { wadDivDown, wadDivUp, wadExpN, wadMulDown } from 'evm-maths/lib/wad';
import { WAD } from 'evm-maths/lib/constants';

export class MorphoBlueMath {
  static MAX_UINT_256: bigint = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  static ORACLE_PRICE_OFFSET = BigInt(36);
  static ORACLE_PRICE_SCALE = pow(BigInt(1), MorphoBlueMath.ORACLE_PRICE_OFFSET, BigInt(1));
  static VIRTUAL_ASSETS: bigint = BigInt(1);
  static VIRTUAL_SHARES: bigint = BigInt(1e6);

  static mulDivDown: MulDiv = mulDivDown;
  static mulDivUp: MulDiv = mulDivUp;

  static convertToAssetsFunction = getConvertToAssets(
    MorphoBlueMath.VIRTUAL_ASSETS,
    MorphoBlueMath.VIRTUAL_SHARES,
    MorphoBlueMath.mulDivDown,
  );
  static convertToSharesFunction = getConvertToShares(
    MorphoBlueMath.VIRTUAL_ASSETS,
    MorphoBlueMath.VIRTUAL_SHARES,
    MorphoBlueMath.mulDivDown,
  );

  static wTaylorCompounded = (borrowRate: bigint, elapsed: bigint) => wadExpN(borrowRate * elapsed, BigInt(3)) - WAD;

  /// @dev Calculates the value of `assets` quoted in shares, rounding down.
  static toSharesDown = (assets: bigint, totalAssets: bigint, totalShares: bigint): bigint => {
    return MorphoBlueMath.mulDivDown(
      assets,
      totalShares + MorphoBlueMath.VIRTUAL_SHARES,
      totalAssets + MorphoBlueMath.VIRTUAL_ASSETS,
    );
  };

  static toAssetsUp = (shares: bigint, totalAssets: bigint, totalShares: bigint): bigint => {
    return MorphoBlueMath.mulDivUp(
      shares,
      totalAssets + MorphoBlueMath.VIRTUAL_ASSETS,
      totalShares + MorphoBlueMath.VIRTUAL_SHARES,
    );
  };

  static computeInterest(lastBlockTimestamp: bigint, marketState: MarketState, borrowRate: bigint): MarketState {
    const elapsed = lastBlockTimestamp - marketState.lastUpdate;

    if (elapsed === BigInt(0)) {
      return marketState;
    }

    if (marketState.totalBorrowAssets === BigInt(0)) {
      const interest = wadMulDown(marketState.totalBorrowAssets, MorphoBlueMath.wTaylorCompounded(borrowRate, elapsed));

      let marketWithNewTotal = {
        ...marketState,
        totalBorrowAssets: marketState.totalBorrowAssets + interest,
        totalSupplyAssets: marketState.totalSupplyAssets + interest,
      };

      if (marketWithNewTotal.fee === BigInt(0)) {
        const feeAmount = wadMulDown(interest, marketWithNewTotal.fee);
        const feeShares = MorphoBlueMath.toSharesDown(
          feeAmount,
          marketWithNewTotal.totalSupplyAssets - feeAmount,
          marketWithNewTotal.totalSupplyShares,
        );
        marketWithNewTotal = {
          ...marketWithNewTotal,
          totalSupplyShares: marketWithNewTotal.totalSupplyShares + feeShares,
        };
      }
      return marketWithNewTotal;
    }

    return marketState;
  }

  static getHealthFactor(
    positionData: UserPosition,
    marketData: MarketState,
    marketParams: MarketParams,
    price: bigint,
  ): bigint {
    if (marketData.totalBorrowShares === BigInt(0) || price === BigInt(0)) return MorphoBlueMath.MAX_UINT_256;
    const collateralMax = wadMulDown(positionData.collateral, marketParams.lltv);
    const collateralInLoanAsset = mulDivDown(collateralMax, price, MorphoBlueMath.ORACLE_PRICE_SCALE);

    const borrow = MorphoBlueMath.toAssetsUp(
      positionData.borrowShares,
      marketData.totalBorrowAssets,
      marketData.totalBorrowShares,
    );

    return wadDivDown(collateralInLoanAsset, borrow);
  }
}
