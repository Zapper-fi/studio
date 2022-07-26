import { BigNumberish } from 'ethers';
import { minBy } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { Token } from '~position/position.interface';

export class CurveVirtualPriceStrategy {
  build<T>({
    resolveVirtualPrice,
  }: {
    resolveVirtualPrice: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<BigNumberish>;
  }) {
    return async ({
      tokens,
      multicall,
      poolContract,
    }: {
      tokens: Token[];
      multicall: IMulticallWrapper;
      poolContract: T;
    }) => {
      const virtualPriceRaw = await resolveVirtualPrice({ multicall, poolContract }).catch(err => {
        // @TODO Create better error handling in Multicall. Throw either a MulticallWeb3CallError, MulticallUnderlyingCallError, MulticallDecodeError
        if (err.message.includes('Multicall call failed')) return '0'; // underlying call failure, virtual price 0
        throw err;
      });

      const virtualPrice = Number(virtualPriceRaw) / 10 ** 18;
      const underlyingTokens = tokens.flatMap(v => (v.type === ContractType.APP_TOKEN ? v.tokens : v));
      const lowestPricedToken = minBy(underlyingTokens, t => t.price)!;
      const price = virtualPrice * lowestPricedToken.price;
      return price;
    };
  }
}
