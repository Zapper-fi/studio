import { constants } from 'ethers';

import type { IMulticallWrapper } from '~multicall/multicall.interface';
import type { AppTokenPosition } from '~position/position.interface';
import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { type ExactlyFixedMarketProps, ExactlyFixedPositionFetcher } from '../common/exactly.fixed-position-fetcher';
import type { ExactlyMarketProps } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';

export abstract class ExactlyFixedBorrowFetcher extends ExactlyFixedPositionFetcher {
  groupLabel = 'Variable Borrow';
  isDebt = true;

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce((total, { borrowed }) => total.add(borrowed), constants.Zero);
  }

  getBestRate({ definition }: GetDataPropsParams<Market, ExactlyFixedMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce(
      (best, { maturity, minBorrowRate: rate }) => (rate.lt(best.rate) ? { maturity, rate } : best),
      { maturity: constants.Zero, rate: constants.MaxUint256 },
    );
  }

  async getBalancePerToken({
    address,
    appToken,
    multicall,
  }: {
    address: string;
    appToken: AppTokenPosition;
    multicall: IMulticallWrapper;
  }) {
    const { fixedBorrowPositions } = await this.definitionsResolver.getDefinition({
      multicall,
      network: this.network,
      account: address,
      market: appToken.address,
    });
    return fixedBorrowPositions.reduce((total, { previewValue }) => total.add(previewValue), constants.Zero);
  }
}
