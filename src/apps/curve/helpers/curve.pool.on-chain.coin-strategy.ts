import { compact, range } from 'lodash';

import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { IMulticallWrapper } from '~multicall/multicall.interface';

import { CurvePoolTokenHelperParams } from './curve.pool.token-helper';

export type CurvePoolOnChainCoinStrategyParams<T> = {
  resolveCoinAddress: (opts: { multicall: IMulticallWrapper; poolContract: T; index: number }) => Promise<string>;
};

export class CurvePoolOnChainCoinStrategy {
  build<T>({
    resolveCoinAddress,
  }: CurvePoolOnChainCoinStrategyParams<T>): CurvePoolTokenHelperParams<T>['resolvePoolCoinAddresses'] {
    return async ({ multicall, poolContract }) => {
      const coinAddresses = await Promise.all(
        range(0, 4).map(index =>
          resolveCoinAddress({ multicall, poolContract, index }).catch(err => {
            if (isMulticallUnderlyingError(err)) return null;
            throw err;
          }),
        ),
      );

      return compact(coinAddresses).map(v => v.toLowerCase());
    };
  }
}
