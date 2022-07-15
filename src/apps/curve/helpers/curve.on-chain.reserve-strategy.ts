import { Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';

import { CurveFactoryPool, CurveV1Pool, CurveV1PoolLegacy, CurveV2Pool } from '../contracts';

@Injectable()
export class CurveOnChainReserveStrategy {
  build() {
    return async ({
      poolContract,
      multicall,
    }: {
      poolContract: CurveV1Pool | CurveV1PoolLegacy | CurveV2Pool | CurveFactoryPool;
      multicall: IMulticallWrapper;
    }) => {
      const tokenAddresses = await Promise.all([
        multicall
          .wrap(poolContract)
          .balances(0)
          .then(v => v.toString())
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .balances(1)
          .then(v => v.toString())
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .balances(2)
          .then(v => v.toString())
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .balances(3)
          .then(v => v.toString())
          .catch(() => null),
      ]);

      return compact(tokenAddresses);
    };
  }
}
