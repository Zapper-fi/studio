import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Token } from '~position/position.interface';

@Injectable()
export class CurveLiquidityAndVirtualPriceStrategy {
  build<T>({
    resolveVirtualPrice,
  }: {
    resolveVirtualPrice: (opts: { multicall: Multicall; poolContract: T }) => Promise<BigNumberish>;
  }) {
    return async ({
      tokens,
      reserves,
      supply,
      multicall,
      poolContract,
    }: {
      tokens: Token[];
      reserves: number[];
      supply: number;
      multicall: Multicall;
      poolContract: T;
    }) => {
      const virtualPriceRaw = await resolveVirtualPrice({ multicall, poolContract });
      const virtualPrice = Number(virtualPriceRaw) / 10 ** 18;
      const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
      const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
      return virtualPrice > 0 ? virtualPrice * (liquidity / supply) : liquidity / supply;
    };
  }
}
