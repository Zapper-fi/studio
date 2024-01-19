import { BigNumber, utils } from 'ethers';

import { MarketParams, MarketState, UserPosition } from './interfaces';

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
  static MAX_UINT_256: BigNumber = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  static ORACLE_PRICE_OFFSET = 36;
  static ORACLE_PRICE_SCALE = utils.parseUnits('1', MorphoBlueMath.ORACLE_PRICE_OFFSET);
  static WAD = BigNumber.from('1000000000000000000'); // 1e18
  static VIRTUAL_SHARES = BigNumber.from('1000000'); // 1e6
  static VIRTUAL_ASSETS = BigNumber.from(1);
  static ZERO = BigNumber.from(0);

  static pow10 = (power: BigNumber) => BigNumber.from(10).pow(power);

  static wMulDown = (x: BigNumber, y: BigNumber): BigNumber => this.mulDivDown(x, y, this.WAD);
  static wDivUp = (x: BigNumber, y: BigNumber): BigNumber => this.mulDivUp(x, this.WAD, y);

  static mulDivDown = (x: BigNumber, y: BigNumber, scale: BigNumber) => {
    if (x.eq(this.ZERO) || y.eq(this.ZERO)) return this.ZERO;

    return x.mul(y).div(scale);
  };

  static mulDivUp = (x: BigNumber, y: BigNumber, scale: BigNumber) => {
    if (x.eq(this.ZERO) || y.eq(this.ZERO)) return this.ZERO;

    return x
      .mul(y)
      .add(scale.sub(BigNumber.from(1)))
      .div(scale);
  };

  /**
   *
   * @param x being the value to get the exponential of
   * @param N being the approx -> N = 3 in Morpho Blue
   * @param scale
   * @returns
   */
  static expN = (x: BigNumber, N: number, scale: BigNumber) => {
    scale = BigNumber.from(scale);

    let res = scale;
    let monomial = scale;
    for (let k = 1; k <= N; k++) {
      monomial = this.mulDivDown(monomial, x, scale.mul(k));
      res = monomial.add(res);
    }

    return res;
  };

  /// @dev Calculates the value of `assets` quoted in shares, rounding down.
  static toSharesDown = (assets: BigNumber, totalAssets: BigNumber, totalShares: BigNumber): BigNumber => {
    return this.mulDivDown(assets, totalShares.add(this.VIRTUAL_SHARES), totalAssets.add(this.VIRTUAL_ASSETS));
  };

  /// @dev Calculates the value of `shares` quoted in assets, rounding down.
  static toAssetsDown = (shares: BigNumber, totalAssets: BigNumber, totalShares: BigNumber): BigNumber => {
    return this.mulDivDown(shares, totalAssets.add(this.VIRTUAL_ASSETS), totalShares.add(this.VIRTUAL_SHARES));
  };

  /// @dev Calculates the value of `assets` quoted in shares, rounding up.
  static toSharesUp = (assets: BigNumber, totalAssets: BigNumber, totalShares: BigNumber): BigNumber => {
    return this.mulDivUp(assets, totalShares.add(this.VIRTUAL_SHARES), totalAssets.add(this.VIRTUAL_ASSETS));
  };

  /// @dev Calculates the value of `shares` quoted in assets, rounding up.
  static toAssetsUp = (shares: BigNumber, totalAssets: BigNumber, totalShares: BigNumber): BigNumber => {
    return this.mulDivUp(shares, totalAssets.add(this.VIRTUAL_ASSETS), totalShares.add(this.VIRTUAL_SHARES));
  };

  static wTaylorCompounded = (x: BigNumber, n: BigNumber): BigNumber => {
    const firstTerm = x.mul(n);
    const secondTerm = this.mulDivDown(firstTerm, firstTerm, BigNumber.from(2).mul(this.WAD));
    const thirdTerm = this.mulDivDown(secondTerm, firstTerm, BigNumber.from(3).mul(this.WAD));
    return firstTerm.add(secondTerm).add(thirdTerm);
  };

  static computeInterest(lastBlockTimestamp: BigNumber, marketState: MarketState, borrowRate: BigNumber): MarketState {
    const elapsed = lastBlockTimestamp.sub(marketState.lastUpdate);

    if (elapsed.eq(this.ZERO)) {
      return marketState;
    }

    if (!marketState.totalBorrowAssets.eq(0)) {
      const interest = MorphoBlueMath.wMulDown(
        marketState.totalBorrowAssets,
        MorphoBlueMath.wTaylorCompounded(borrowRate, elapsed),
      );

      let marketWithNewTotal = {
        ...marketState,
        totalBorrowAssets: marketState.totalBorrowAssets.add(interest),
        totalSupplyAssets: marketState.totalSupplyAssets.add(interest),
      };

      if (!marketWithNewTotal.fee.eq(0)) {
        const feeAmount = MorphoBlueMath.wMulDown(interest, marketWithNewTotal.fee);
        const feeShares = MorphoBlueMath.toSharesDown(
          feeAmount,
          marketWithNewTotal.totalSupplyAssets.sub(feeAmount),
          marketWithNewTotal.totalSupplyShares,
        );
        marketWithNewTotal = {
          ...marketWithNewTotal,
          totalSupplyShares: marketWithNewTotal.totalSupplyShares.add(feeShares),
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
    price: BigNumber,
  ) {
    if (marketData.totalBorrowShares.eq(0) || price.eq(0)) return this.MAX_UINT_256;
    const collateralMax = this.wMulDown(positionData.collateral, marketParams.lltv);
    const collateralInLoanAsset = this.mulDivDown(collateralMax, price, this.ORACLE_PRICE_SCALE);

    const borrow = this.toAssetsUp(
      positionData.borrowShares,
      marketData.totalBorrowAssets,
      marketData.totalBorrowShares,
    );

    return this.wDivUp(collateralInLoanAsset, borrow);
  }
}
