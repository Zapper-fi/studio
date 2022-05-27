import { PositionBalance } from '~position/position-balance.interface';

import { TokenBalanceResponse } from './balance-fetcher.interface';

export interface BalancePresenter {
  present(balances: PositionBalance[]): Promise<TokenBalanceResponse>;
}
