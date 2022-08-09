import { Network } from '~types';

import { AppTokenPosition } from './position.interface';

export type LoggingTags = { network?: Network; context?: string };
export type AppTokenSelectorKey = { network: Network; address: string };
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
