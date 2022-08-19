import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { PositionBalance } from '~position/position-balance.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';

import { TokenBalanceResponse } from './balance-fetcher.interface';

export interface BalancePresenter {
  present(address: string, balances: PositionBalance[]): Promise<TokenBalanceResponse>;
}

export type ReadonlyBalances = ReadonlyArray<Readonly<Balance>>;
export type GroupMeta = MetadataItemWithLabel[];
export type Balance = TokenBalance | ContractPositionBalance;
