import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';

export abstract class BalancePresenterTemplate {
  abstract groupLabelSelector: string;
}

export type GroupMeta = MetadataItemWithLabel[];
export type Balance = TokenBalance | ContractPositionBalance;
