import { PositionBalance } from '~position/position-balance.interface';

import { TokenBalanceResponse } from './balance-fetcher.interface';

export interface BalanceAfterware {
  use(balances: PositionBalance[]): Promise<TokenBalanceResponse>;
}
