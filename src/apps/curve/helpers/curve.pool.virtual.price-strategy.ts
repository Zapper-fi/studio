import { BigNumberish } from 'ethers';
import { minBy } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';

import { CurvePoolType } from './curve.pool.registry';
import { CurvePoolTokenHelperParams } from './curve.pool.token-helper';

export type CurvePoolVirtualPriceStrategyParams<T> = {
  resolveVirtualPrice: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<BigNumberish>;
};

export class CurvePoolVirtualPriceStrategy {
  build<T>({
    resolveVirtualPrice,
  }: CurvePoolVirtualPriceStrategyParams<T>): CurvePoolTokenHelperParams<T>['resolvePoolTokenPrice'] {
    return async ({ tokens, multicall, poolContract, supply, reserves, poolType }) => {
      const virtualPriceRaw = await resolveVirtualPrice({ multicall, poolContract });
      const virtualPrice = Number(virtualPriceRaw) / 10 ** 18;

      if ([CurvePoolType.CRYPTO, CurvePoolType.FACTORY_CRYPTO].includes(poolType)) {
        const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
        const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
        return virtualPrice > 0 ? virtualPrice * (liquidity / supply) : liquidity / supply;
      } else {
        const underlyingTokens = tokens.flatMap(v => (v.type === ContractType.APP_TOKEN ? v.tokens : v));
        const lowestPricedToken = minBy(underlyingTokens, t => t.price)!;
        const price = virtualPrice * lowestPricedToken.price;
        return price;
      }
    };
  }
}
