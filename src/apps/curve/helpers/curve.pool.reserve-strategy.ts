import { Injectable } from '@nestjs/common';

import { CurvePool } from '../contracts';

import { CurvePoolTokenHelperParams } from './curve.pool.token-helper';

@Injectable()
export class CurvePoolReserveStrategy {
  build(): CurvePoolTokenHelperParams<CurvePool>['resolvePoolReserves'] {
    return async ({ poolContract, multicall, coinAddresses }) => {
      const tokenAddresses = await Promise.all(coinAddresses.map((_, i) => multicall.wrap(poolContract).balances(i)));
      return tokenAddresses.map(v => v.toString());
    };
  }
}
