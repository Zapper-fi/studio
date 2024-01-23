import { BigNumber, constants } from 'ethers';

import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { type ExactlyFixedMarketProps, ExactlyFixedPositionFetcher } from '../common/exactly.fixed-position-fetcher';
import type { ExactlyMarketProps } from '../common/exactly.token-fetcher';
import { Market } from '../contracts/viem';

export abstract class ExactlyFixedBorrowFetcher extends ExactlyFixedPositionFetcher {
  groupLabel = 'Variable Borrow';
  isDebt = true;

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce((total, { borrowed }) => total.add(borrowed), constants.Zero);
  }

  getBestRate({ definition }: GetDataPropsParams<Market, ExactlyFixedMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce(
      (best, { maturity, minBorrowRate: rate }) => (BigNumber.from(rate).lt(best.rate) ? { maturity, rate } : best),
      { maturity: constants.Zero, rate: constants.MaxUint256 },
    );
  }
}
