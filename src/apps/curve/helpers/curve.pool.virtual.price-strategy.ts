import { BigNumberish } from 'ethers';

import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { IMulticallWrapper } from '~multicall/multicall.interface';

import { CurvePoolTokenHelperParams } from './curve.pool.token-helper';

export type CurvePoolVirtualPriceStrategyParams<T> = {
  resolveVirtualPrice: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<BigNumberish>;
};

export class CurvePoolVirtualPriceStrategy {
  build<T>({
    resolveVirtualPrice,
  }: CurvePoolVirtualPriceStrategyParams<T>): CurvePoolTokenHelperParams<T>['resolvePoolTokenPrice'] {
    return async ({ tokens, multicall, poolContract, supply, reserves }) => {
      const virtualPriceRaw = await resolveVirtualPrice({ multicall, poolContract }).catch(err => {
        if (isMulticallUnderlyingError(err)) return '0';
        throw err;
      });

      const virtualPrice = Number(virtualPriceRaw) / 10 ** 18;
      const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
      const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
      return virtualPrice > 0 ? virtualPrice * (liquidity / supply) : liquidity / supply;
    };
  }
}
