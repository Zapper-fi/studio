import { DefaultDataProps, WithMetaType } from './display.interface';
import { AppTokenPosition, ContractPosition, NonFungibleToken } from './position.interface';
import { BaseToken } from './token.interface';

//  POSITION BALANCES
export type WithTokenBalance<T> = T & {
  balance: number;
  balanceRaw: string;
  balanceUSD: number;
};

export type BaseTokenBalance = WithTokenBalance<BaseToken>;

export type NonFungibleTokenBalance = WithTokenBalance<NonFungibleToken>;

export type AppTokenBalance<T = DefaultDataProps> = Omit<WithTokenBalance<AppTokenPosition<T>>, 'tokens'> & {
  tokens: (BaseTokenBalance | AppTokenBalance | NonFungibleTokenBalance)[];
};

export interface ContractPositionBalance<T = DefaultDataProps> extends ContractPosition<T> {
  tokens: WithMetaType<TokenBalance>[];
  balanceUSD: number;
}

export type TokenBalance = BaseTokenBalance | AppTokenBalance | NonFungibleTokenBalance;
export type PositionBalance<T = DefaultDataProps> =
  | ContractPositionBalance<T>
  | AppTokenBalance<T>
  | NonFungibleTokenBalance;
