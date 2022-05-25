import { compact } from 'lodash';

import { EthersMulticall as Multicall } from '~multicall';

import { SaddleSwap } from '../contracts';

export class SaddleOnChainReserveStrategy {
  build() {
    return async ({ poolContract, multicall }: { poolContract: SaddleSwap; multicall: Multicall }) => {
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
