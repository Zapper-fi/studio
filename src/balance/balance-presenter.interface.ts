import { PositionBalance } from '~position/position-balance.interface';

import { TokenBalanceResponse } from './balance-fetcher.interface';

export interface BalancePresenter {
  present(address: string, balances: PositionBalance[]): Promise<TokenBalanceResponse>;
}
