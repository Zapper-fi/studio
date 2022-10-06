import { BigNumberish } from 'ethers';

import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { IMulticallWrapper } from '~multicall/multicall.interface';

import { CurvePoolType } from '../curve.types';

import { CurvePoolTokenHelperParams } from './curve.pool.token-helper';

export type CurvePoolVirtualPriceStrategyParams<T> = {
  resolveVirtualPrice: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<BigNumberish>;
};

export class CurvePoolVirtualPriceStrategy {
  build<T>({
    resolveVirtualPrice,
  }: CurvePoolVirtualPriceStrategyParams<T>): CurvePoolTokenHelperParams<T>['resolvePoolTokenPrice'] {
    return async ({ tokens, multicall, poolContract, supply, reserves, poolType }) => {
      // Curve UI calculates pool token prices as follows:
      // 1. Factory V2 pools are calculated as reserves in USD divided by supply times virtual price
      // 2. Crypto pools are calculated as reserves in USD divided by supply
      // 3. Stable pools are calculated simply as the price of their reference asset

      // Given that pools like 4Pool with UST have a "failed" asset, the reference asset isn't enough alone
      // So we'll calculate these pool token prices as the reserves in USD divided by the supply

      if ([CurvePoolType.CRYPTO, CurvePoolType.FACTORY_CRYPTO].includes(poolType)) {
        const virtualPriceRaw = await resolveVirtualPrice({ multicall, poolContract }).catch(err => {
          if (isMulticallUnderlyingError(err)) return '0';
          throw err;
        });

        const virtualPrice = Number(virtualPriceRaw) / 10 ** 18;
        const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
        const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
        return virtualPrice > 0 ? virtualPrice * (liquidity / supply) : liquidity / supply;
      } else {
        const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
        const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
        return liquidity / supply;
      }
    };
  }
}
