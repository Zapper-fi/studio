import { Injectable } from '@nestjs/common';

import { Token } from '~position/position.interface';

@Injectable()
export class CurveLiquidityPriceStrategy {
  build() {
    return async ({ tokens, reserves, supply }: { tokens: Token[]; reserves: number[]; supply: number }) => {
      const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
      const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
      return liquidity / supply;
    };
  }
}
