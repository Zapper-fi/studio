import { Network } from '~types';

import { AppTokenPosition } from '../position.interface';

export type LoggingTags = {
  network?: Network;
  context?: string;
};

export type AppTokenSelectorKey = {
  address: string;
  network: Network;
  tokenId?: string;
};

export type GetOne = (opts: AppTokenSelectorKey) => Promise<AppTokenPosition | null>;
export type GetMany = (opts: AppTokenSelectorKey[]) => Promise<(AppTokenPosition | null)[]>;

export interface AppTokenSelector {
  getOne: GetOne;
  getMany: GetMany;
}

export type CreateAppTokenSelectorOptions = { tags?: LoggingTags };

export interface AppTokenSelectorFactory {
  create: (opts: CreateAppTokenSelectorOptions) => AppTokenSelector;
}
