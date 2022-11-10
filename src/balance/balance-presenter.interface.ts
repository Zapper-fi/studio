import { PositionBalance } from '~position/position-balance.interface';

import { LazyTokenBalanceResponse } from './balance-fetcher.interface';

export interface BalancePresenter {
  present(address: string, balances: PositionBalance[]): Promise<LazyTokenBalanceResponse>;
}
