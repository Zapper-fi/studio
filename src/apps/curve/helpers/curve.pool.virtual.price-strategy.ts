import { BigNumberish } from 'ethers';

import { IMulticallWrapper } from '~multicall/multicall.interface';

import { CurvePoolTokenHelperParams } from './curve.pool.token-helper';

export type CurvePoolVirtualPriceStrategyParams<T> = {
  resolveVirtualPrice: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<BigNumberish>;
};

export class CurvePoolVirtualPriceStrategy {
  build<T>(_params: CurvePoolVirtualPriceStrategyParams<T>): CurvePoolTokenHelperParams<T>['resolvePoolTokenPrice'] {
    return async ({ tokens, supply, reserves }) => {
      const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
      const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
      return liquidity / supply;
    };
  }
}
