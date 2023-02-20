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

export type AppTokenPositionBalance<T = DefaultDataProps> = Omit<WithTokenBalance<AppTokenPosition<T>>, 'tokens'> & {
  tokens: (BaseTokenBalance | AppTokenPositionBalance | NonFungibleTokenBalance)[];
};

export interface ContractPositionBalance<T = DefaultDataProps> extends ContractPosition<T> {
  tokens: WithMetaType<TokenBalance>[];
  balanceUSD: number;
}

export type RawTokenBalance = {
  key: string;
  balance: string;
};

export type RawAppTokenBalance = RawTokenBalance;

export type RawContractPositionBalance = {
  key: string;
  tokens: RawTokenBalance[];
};

export type TokenBalance = BaseTokenBalance | AppTokenPositionBalance | NonFungibleTokenBalance;
export type PositionBalance<T = DefaultDataProps> = ContractPositionBalance<T> | AppTokenPositionBalance<T>;
