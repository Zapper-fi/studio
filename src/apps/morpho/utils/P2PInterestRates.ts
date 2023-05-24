import { PercentMath, WadRayMath } from '@morpho-labs/ethers-utils/lib/maths';
import { minBN } from '@morpho-labs/ethers-utils/lib/utils';
import { BigNumber, constants } from 'ethers';

import { Types } from '~apps/morpho/contracts/ethers/MorphoAaveV3';

import { MorphoAaveMath } from './AaveV3.maths';

import MarketSideDeltaStruct = Types.MarketSideDeltaStruct;
import DeltasStruct = Types.DeltasStruct;

export interface MarketSizeIndexes {
  /** The pool index (in ray). */
  poolIndex: BigNumber;

  /** The peer-to-peer index (in ray). */
  p2pIndex: BigNumber;
}

export interface GrowthFactors {
  /** The pool's supply index growth factor (in ray). */
  poolSupplyGrowthFactor: BigNumber;

  /** Peer-to-peer supply index growth factor (in ray). */
  p2pSupplyGrowthFactor: BigNumber;

  /** The pool's borrow index growth factor (in ray). */
  poolBorrowGrowthFactor: BigNumber;

  /** Peer-to-peer borrow index growth factor (in ray). */
  p2pBorrowGrowthFactor: BigNumber;
}

export interface IndexesParams {
  /** The last stored pool supply index (in ray). */
  lastSupplyIndexes: MarketSizeIndexes;

  /** The last stored pool borrow index (in ray). */
  lastBorrowIndexes: MarketSizeIndexes;

  /** The current pool supply index (in ray). */
  poolSupplyIndex: BigNumber;

  /** The current pool borrow index (in ray). */
  poolBorrowIndex: BigNumber;

  /** The reserve factor percentage (10 000 = 100%). */
  reserveFactor: BigNumber;

  /** The peer-to-peer index cursor (10 000 = 100%). */
  p2pIndexCursor: BigNumber;

  /** The deltas and peer-to-peer amounts. */
  deltas: DeltasStruct;

  /** The amount of proportion idle (in underlying). */
  proportionIdle: BigNumber;
}

export interface RateParams {
  /** The pool supply rate per year (in ray). */
  poolSupplyRatePerYear: BigNumber;

  /** The pool borrow rate per year (in ray). */
  poolBorrowRatePerYear: BigNumber;

  /** The last stored pool index (in ray). */
  poolIndex: BigNumber;

  /** The last stored peer-to-peer index (in ray). */
  p2pIndex: BigNumber;

  /** The delta and peer-to-peer amount. */
  delta: MarketSideDeltaStruct;

  /** The index cursor of the given market (in bps). */
  p2pIndexCursor: BigNumber;

  /** The reserve factor of the given market (in bps). */
  reserveFactor: BigNumber;

  /** The proportion idle of the given market (in underlying). */
  proportionIdle: BigNumber;
}

export default class P2PInterestRates {
  __MATHS__ = new MorphoAaveMath();

  constructor() {}

  public computeP2PIndexes({
    p2pIndexCursor,
    lastBorrowIndexes,
    lastSupplyIndexes,
    poolBorrowIndex,
    poolSupplyIndex,
    deltas,
    reserveFactor,
    proportionIdle,
  }: IndexesParams) {
    const { poolSupplyGrowthFactor, poolBorrowGrowthFactor, p2pBorrowGrowthFactor, p2pSupplyGrowthFactor } =
      this._computeGrowthFactors(
        poolSupplyIndex,
        poolBorrowIndex,
        lastSupplyIndexes.poolIndex,
        lastBorrowIndexes.poolIndex,
        p2pIndexCursor,
        reserveFactor,
      );
    const newP2PSupplyIndex = this._computeP2PIndex(
      poolSupplyGrowthFactor,
      p2pSupplyGrowthFactor,
      lastSupplyIndexes,
      BigNumber.from(deltas.supply.scaledDelta),
      BigNumber.from(deltas.supply.scaledP2PTotal),
      proportionIdle,
    );
    const newP2PBorrowIndex = this._computeP2PIndex(
      poolBorrowGrowthFactor,
      p2pBorrowGrowthFactor,
      lastBorrowIndexes,
      BigNumber.from(deltas.borrow.scaledDelta),
      BigNumber.from(deltas.borrow.scaledP2PTotal),
      constants.Zero,
    );
    return {
      newP2PSupplyIndex,
      newP2PBorrowIndex,
    };
  }

  public computeP2PSupplyRatePerYear({
    poolSupplyRatePerYear,
    poolBorrowRatePerYear,
    poolIndex,
    p2pIndex,
    p2pIndexCursor,
    reserveFactor,
    proportionIdle,
    delta,
  }: RateParams) {
    let p2pSupplyRate;

    if (poolSupplyRatePerYear.gt(poolBorrowRatePerYear)) p2pSupplyRate = poolBorrowRatePerYear;
    else {
      const p2pRate = this._weightedAverage(poolSupplyRatePerYear, poolBorrowRatePerYear, p2pIndexCursor);

      p2pSupplyRate = p2pRate.sub(this.__MATHS__.percentMul(p2pRate.sub(poolBorrowRatePerYear), reserveFactor));
    }

    if (BigNumber.from(delta.scaledDelta).gt(0) && BigNumber.from(delta.scaledP2PTotal).gt(0)) {
      const proportionDelta = minBN(
        this.__MATHS__.indexDivUp(
          this.__MATHS__.indexMul(BigNumber.from(delta.scaledDelta), poolIndex),
          this.__MATHS__.indexMul(BigNumber.from(delta.scaledP2PTotal), p2pIndex),
        ),
        this.__MATHS__.INDEX_ONE.sub(proportionIdle), // To avoid proportionDelta + proportionIdle > 1 with rounding errors.
      );

      p2pSupplyRate = this.__MATHS__
        .indexMul(p2pSupplyRate, this.__MATHS__.INDEX_ONE.sub(proportionDelta).sub(proportionIdle))
        .add(this.__MATHS__.indexMul(poolSupplyRatePerYear, proportionDelta))
        .add(proportionIdle);
    }

    return p2pSupplyRate;
  }
  public computeP2PBorrowRatePerYear({
    poolSupplyRatePerYear,
    poolBorrowRatePerYear,
    poolIndex,
    p2pIndex,
    p2pIndexCursor,
    reserveFactor,
    proportionIdle,
    delta,
  }: RateParams) {
    let p2pBorrowRate;

    if (poolSupplyRatePerYear.gt(poolBorrowRatePerYear)) p2pBorrowRate = poolBorrowRatePerYear;
    else {
      const p2pRate = this._weightedAverage(poolSupplyRatePerYear, poolBorrowRatePerYear, p2pIndexCursor);

      p2pBorrowRate = p2pRate.add(this.__MATHS__.percentMul(poolBorrowRatePerYear.sub(p2pRate), reserveFactor));
    }

    if (BigNumber.from(delta.scaledDelta).gt(0) && BigNumber.from(delta.scaledP2PTotal).gt(0)) {
      const proportionDelta = minBN(
        this.__MATHS__.indexDivUp(
          this.__MATHS__.indexMul(BigNumber.from(delta.scaledDelta), poolIndex),
          this.__MATHS__.indexMul(BigNumber.from(delta.scaledP2PTotal), p2pIndex),
        ),
        this.__MATHS__.INDEX_ONE.sub(proportionIdle), // To avoid proportionDelta + proportionIdle > 1 with rounding errors.
      );

      p2pBorrowRate = this.__MATHS__
        .indexMul(p2pBorrowRate, this.__MATHS__.INDEX_ONE.sub(proportionDelta).sub(proportionIdle))
        .add(this.__MATHS__.indexMul(poolBorrowRatePerYear, proportionDelta))
        .add(proportionIdle);
    }

    return p2pBorrowRate;
  }

  private _computeGrowthFactors(
    newPoolSupplyIndex: BigNumber,
    newPoolBorrowIndex: BigNumber,
    lastPoolSupplyIndex: BigNumber,
    lastPoolBorrowIndex: BigNumber,
    p2pIndexCursor: BigNumber,
    reserveFactor: BigNumber,
  ): GrowthFactors {
    const poolSupplyGrowthFactor = this.__MATHS__.indexDiv(newPoolSupplyIndex, lastPoolSupplyIndex);

    const poolBorrowGrowthFactor = this.__MATHS__.indexDiv(newPoolBorrowIndex, lastPoolBorrowIndex);

    let p2pSupplyGrowthFactor;
    let p2pBorrowGrowthFactor;

    if (poolSupplyGrowthFactor.lte(poolBorrowGrowthFactor)) {
      const p2pGrowthFactor = this._weightedAverage(poolSupplyGrowthFactor, poolBorrowGrowthFactor, p2pIndexCursor);

      p2pSupplyGrowthFactor = p2pGrowthFactor.sub(
        PercentMath.percentMul(p2pGrowthFactor.sub(poolSupplyGrowthFactor), reserveFactor),
      );

      p2pBorrowGrowthFactor = p2pGrowthFactor.add(
        PercentMath.percentMul(poolBorrowGrowthFactor.sub(p2pGrowthFactor), reserveFactor),
      );
    } else {
      // The case poolSupplyGrowthFactor > poolBorrowGrowthFactor happens because someone has done a flashloan on Aave:
      // the peer-to-peer growth factors are set to the pool borrow growth factor.
      p2pSupplyGrowthFactor = poolBorrowGrowthFactor;
      p2pBorrowGrowthFactor = poolBorrowGrowthFactor;
    }

    return {
      poolSupplyGrowthFactor,
      p2pSupplyGrowthFactor,
      poolBorrowGrowthFactor,
      p2pBorrowGrowthFactor,
    };
  }

  private _computeP2PIndex(
    poolGrowthFactor: BigNumber,
    p2pGrowthFactor: BigNumber,
    lastIndexes: MarketSizeIndexes,
    scaledDelta: BigNumber,
    scaledP2PTotal: BigNumber,
    proportionIdle: BigNumber,
  ): BigNumber {
    if (scaledP2PTotal.isZero() || (scaledDelta.isZero() && proportionIdle.isZero()))
      return this.__MATHS__.indexMul(lastIndexes.p2pIndex, p2pGrowthFactor);

    const proportionDelta = minBN(
      WadRayMath.rayDivUp(
        this.__MATHS__.indexMul(scaledDelta, lastIndexes.poolIndex),
        this.__MATHS__.indexMul(scaledP2PTotal, lastIndexes.p2pIndex),
      ),
      this.__MATHS__.INDEX_ONE.sub(proportionIdle), // To avoid proportionDelta + proportionIdle > 1 with rounding errors.
    );

    // Equivalent to:
    // lastP2PIndex * (
    // p2pGrowthFactor * (1 - proportionDelta - proportionIdle) +
    // poolGrowthFactor * proportionDelta +
    // idleGrowthFactor * proportionIdle)
    // Notice that the idleGrowthFactor is always equal to 1 (no interests accumulated).
    return this.__MATHS__.indexMul(
      lastIndexes.p2pIndex,
      this.__MATHS__
        .indexMul(p2pGrowthFactor, this.__MATHS__.INDEX_ONE.sub(proportionDelta).sub(proportionIdle))
        .add(this.__MATHS__.indexMul(poolGrowthFactor, proportionDelta))
        .add(proportionIdle),
    );
  }

  private _weightedAverage(x: BigNumber, y: BigNumber, percentage: BigNumber) {
    const z = PercentMath.BASE_PERCENT.sub(percentage);
    return x.mul(z).add(y.mul(percentage)).add(PercentMath.HALF_PERCENT).div(PercentMath.BASE_PERCENT);
  }
}
