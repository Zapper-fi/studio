import { AppTokenPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types';

export type LoggingTags = {
  network?: Network;
  context?: string;
};

export type TokenDependencySelectorKey = {
  address: string;
  network: Network;
  tokenId?: number;
};

export type TokenDependency = BaseToken | AppTokenPosition;

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
