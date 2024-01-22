import { MarketParams, MarketState, UserPosition } from './interfaces';

import { MulDiv, getConvertToAssets, getConvertToShares, mulDivDown, mulDivUp, pow } from 'evm-maths/lib/utils';
import { wadDivUp, wadMulDown } from 'evm-maths/lib/wad';
import { WAD } from 'evm-maths/lib/constants';

export const OraclePriceAbi = [
  {
    constant: true,
    inputs: [],
    name: 'price',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export class MorphoBlueMath {
  static MAX_UINT_256: bigint = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  static ORACLE_PRICE_OFFSET = BigInt(36);
  static ORACLE_PRICE_SCALE = pow(BigInt(1), this.ORACLE_PRICE_OFFSET, BigInt(1));
  static VIRTUAL_ASSETS: bigint = BigInt(1);
  static VIRTUAL_SHARES: bigint = BigInt(1e6);

  static mulDivFunction: MulDiv = mulDivDown;
  static mulDivUp: MulDiv = mulDivUp;

  static convertToAssetsFunction = getConvertToAssets(this.VIRTUAL_ASSETS, this.VIRTUAL_SHARES, this.mulDivFunction);
  static convertToSharesFunction = getConvertToShares(this.VIRTUAL_ASSETS, this.VIRTUAL_SHARES, this.mulDivFunction);

  static wTaylorCompounded = (x: bigint, n: bigint): bigint => {
    const firstTerm = x * n;
    const secondTerm = mulDivDown(firstTerm, firstTerm, BigInt(2) * n * WAD);
    const thirdTerm = mulDivDown(secondTerm, firstTerm, BigInt(3) * n * WAD);
    return firstTerm + secondTerm + thirdTerm;
  };

  /// @dev Calculates the value of `assets` quoted in shares, rounding down.
  static toSharesDown = (assets: bigint, totalAssets: bigint, totalShares: bigint): bigint => {
    return this.mulDivFunction(assets, totalShares + this.VIRTUAL_SHARES, totalAssets + this.VIRTUAL_ASSETS);
  };

  static toAssetsUp = (shares: bigint, totalAssets: bigint, totalShares: bigint): bigint => {
    return this.mulDivUp(shares, totalAssets + this.VIRTUAL_ASSETS, totalShares + this.VIRTUAL_SHARES);
  };

  static computeInterest(lastBlockTimestamp: bigint, marketState: MarketState, borrowRate: bigint): MarketState {
    const elapsed = lastBlockTimestamp - marketState.lastUpdate;

    if (elapsed === BigInt(0)) {
      return marketState;
    }

    if (marketState.totalBorrowAssets === BigInt(0)) {
      const interest = wadMulDown(marketState.totalBorrowAssets, this.wTaylorCompounded(borrowRate, elapsed));

      let marketWithNewTotal = {
        ...marketState,
        totalBorrowAssets: marketState.totalBorrowAssets + interest,
        totalSupplyAssets: marketState.totalSupplyAssets + interest,
      };

      if (marketWithNewTotal.fee === BigInt(0)) {
        const feeAmount = wadMulDown(interest, marketWithNewTotal.fee);
        const feeShares = this.toSharesDown(
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
    if (marketData.totalBorrowShares === BigInt(0) || price === BigInt(0)) return this.MAX_UINT_256;
    const collateralMax = wadMulDown(positionData.collateral, marketParams.lltv);
    const collateralInLoanAsset = mulDivDown(collateralMax, price, this.ORACLE_PRICE_SCALE);

    const borrow = this.toAssetsUp(
      positionData.borrowShares,
      marketData.totalBorrowAssets,
      marketData.totalBorrowShares,
    );

    return wadDivUp(collateralInLoanAsset, borrow);
  }
}
