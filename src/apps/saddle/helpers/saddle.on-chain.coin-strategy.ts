import { compact } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';

import { SaddleSwap } from '../contracts';

export class SaddleOnChainCoinStrategy {
  build() {
    return async ({ poolContract, multicall }: { poolContract: SaddleSwap; multicall: IMulticallWrapper }) => {
      const tokenAddresses = await Promise.all([
        multicall
          .wrap(poolContract)
          .getToken(0)
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .getToken(1)
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .getToken(2)
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .getToken(3)
          .catch(() => null),
      ]);

      return compact(tokenAddresses).map(v => v.toLowerCase());
    };
  }
}
