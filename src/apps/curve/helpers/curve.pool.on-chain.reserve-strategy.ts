import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';

import { CurvePoolTokenHelperParams } from './curve.pool.token-helper';

export type CurvePoolOnChainReserveStrategyParams<T> = {
  resolveReserve: (opts: { multicall: IMulticallWrapper; poolContract: T; index: number }) => Promise<BigNumberish>;
};

export class CurvePoolOnChainReserveStrategy {
  build<T>({
    resolveReserve,
  }: CurvePoolOnChainReserveStrategyParams<T>): CurvePoolTokenHelperParams<T>['resolvePoolReserves'] {
    return async ({ multicall, poolContract, coinAddresses }) => {
      const reserves = await Promise.all(
        range(0, coinAddresses.length).map(index => resolveReserve({ multicall, poolContract, index })),
      );

      return reserves;
    };
  }
}
