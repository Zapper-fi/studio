import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

export type BaseTokenPrice = BaseToken & { hide: boolean; canExchange: boolean };

export type Filters = { exchangeable?: boolean; hidden?: boolean };
export type LoggingTags = { appId?: string; network?: Network };

export type GetAll = (opts: { network: Network }) => Promise<BaseTokenPrice[]>;
export type GetOne = (opts: Parameters<GetAll>[0] & { address: string }) => Promise<BaseTokenPrice | null>;

export interface PriceSelector {
  getAll: GetAll;
  getOne: GetOne;
}

export type CreatePriceSelectorOptions = { filters?: Filters; tags?: LoggingTags };

export interface PriceSelectorFactory {
  create: (opts: CreatePriceSelectorOptions) => PriceSelector;
}
