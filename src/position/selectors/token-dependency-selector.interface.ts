import { AppTokenPosition, NonFungibleToken } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types';

export type LoggingTags = {
  network?: Network;
  context?: string;
};

export type TokenDependencySelectorKey = {
  address: string;
  network: Network;
  tokenId?: string;
};

export type TokenDependency = BaseToken | AppTokenPosition | NonFungibleToken;

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
