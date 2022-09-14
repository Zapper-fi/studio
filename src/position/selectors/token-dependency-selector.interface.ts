import { AppTokenPosition } from '~position/position.interface';
import { BaseTokenPrice } from '~token/selectors/token-price-selector.interface';
import { Network } from '~types';

export type LoggingTags = {
  network?: Network;
  context?: string;
};
export type TokenDependencySelectorKey = {
  network: Network;
  address: string;
};

export type TokenDependency = AppTokenPosition | BaseTokenPrice;

export type GetOne = (opts: TokenDependencySelectorKey) => Promise<TokenDependency | null>;
export type GetMany = (opts: TokenDependencySelectorKey[]) => Promise<(TokenDependency | null)[]>;
export interface TokenDependencySelector {
  getOne: GetOne;
  getMany: GetMany;
}
export type CreateTokenDependencySelectorOptions = {
  tags?: LoggingTags;
};
export interface TokenDependencySelectorFactory {
  create: (opts: CreateTokenDependencySelectorOptions) => TokenDependencySelector;
}
