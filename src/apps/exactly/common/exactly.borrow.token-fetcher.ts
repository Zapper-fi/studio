import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { type ExactlyMarketProps, ExactlyTokenFetcher } from '../common/exactly.token-fetcher';
import { Market } from '../contracts/viem';

export abstract class ExactlyBorrowFetcher extends ExactlyTokenFetcher {
  groupLabel = 'Variable Borrow';
  isDebt = true;

  getSupply({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Promise.resolve(definition.totalFloatingBorrowShares);
  }

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.totalFloatingBorrowAssets;
  }

  getApr({ definition }: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Number(definition.floatingBorrowRate) / 1e16;
  }
}
