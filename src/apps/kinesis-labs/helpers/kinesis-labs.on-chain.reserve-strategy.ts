import { compact } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';

import { KinesisLabsPool } from '../contracts';

export class KinesisLabsOnChainReserveStrategy {
  build() {
    return async ({ poolContract, multicall }: { poolContract: KinesisLabsPool; multicall: IMulticallWrapper }) => {
      const tokenAddresses = await Promise.all([
        multicall
          .wrap(poolContract)
          .getTokenBalance(0)
          .then(v => v.toString())
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .getTokenBalance(1)
          .then(v => v.toString())
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .getTokenBalance(2)
          .then(v => v.toString())
          .catch(() => null),
        multicall
          .wrap(poolContract)
          .getTokenBalance(3)
          .then(v => v.toString())
          .catch(() => null),
      ]);

      return compact(tokenAddresses);
    };
  }
}
