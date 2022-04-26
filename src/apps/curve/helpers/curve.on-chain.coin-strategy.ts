import { Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';

import { CurveFactoryPool, CurveV1Pool, CurveV1PoolLegacy, CurveV2Pool } from '../contracts';

@Injectable()
export class CurveOnChainCoinStrategy {
  build() {
    return async ({
      poolContract,
      multicall,
    }: {
      poolContract: CurveV1Pool | CurveV1PoolLegacy | CurveV2Pool | CurveFactoryPool;
      multicall: Multicall;
    }) => {
      const tokenAddresses = await Promise.all([
        multicall
          .wrap(poolContract)
          .coins(0)
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .coins(1)
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .coins(2)
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .coins(3)
          .catch(() => null),
      ]);

      return compact(tokenAddresses).map(v => v.toLowerCase());
    };
  }
}
