import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import type { GetTokenPropsParams } from '~position/template/app-token.template.types';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { type ExactlyMarketProps, ExactlyTokenFetcher } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';

@PositionTemplate()
export class EthereumExactlyDepositFetcher extends ExactlyTokenFetcher {
  groupLabel = 'Variable Deposit';

  getSupply({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Promise.resolve(definition.totalFloatingDepositShares);
  }

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.totalFloatingDepositAssets;
  }
}
