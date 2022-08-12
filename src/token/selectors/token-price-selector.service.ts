import { Inject, Injectable, Logger } from '@nestjs/common';
import DataLoader from 'dataloader';
import { isNil, map } from 'lodash';

import { Network } from '~types';

import { TokenApiClient } from '../token-api.client';

import {
  BaseTokenPrice,
  CreatePriceSelectorOptions,
  Filters,
  GetAll,
  GetMany,
  GetOne,
  PriceSelector,
  PriceSelectorFactory,
} from './token-price-selector.interface';

type TokenDataLoaderKey = { network: Network; address: string };

@Injectable()
export class PriceSelectorService implements PriceSelectorFactory {
  private logger = new Logger(PriceSelectorService.name);
  private tokenCache = new Map<Network, Map<string, BaseTokenPrice>>();

  constructor(@Inject(TokenApiClient) private readonly tokenApiClient: TokenApiClient) {}

  private async getAllFromCache({ network }: Parameters<GetAll>[0], filters: Filters = {}) {
    const cacheTokenMap = this.tokenCache.get(network);
    if (!cacheTokenMap) throw new Error(`Could not retrieve "${network}" tokens from cache`);
    const tokens = Array.from(cacheTokenMap.values());

    return tokens.filter(t => {
      if (!isNil(filters.exchangeable) && filters.exchangeable !== t.canExchange) return false;
      if (!isNil(filters.hidden) && filters.hidden !== t.hide) return false;
      return true;
    });
  }

  private getOneFromCache({ network, address }: Parameters<GetOne>[0], filters: Filters = {}) {
    const match = this.tokenCache.get(network)?.get(address);

    if (!match) return null;
    if (!isNil(filters.exchangeable) && filters.exchangeable !== match.canExchange) return null;
    if (!isNil(filters.hidden) && filters.hidden !== match.hide) return null;

    return match;
  }

  create(opts: CreatePriceSelectorOptions = {}): PriceSelector {
    const { filters = {} } = opts;
    const tokenDataLoader = new DataLoader<TokenDataLoaderKey, BaseTokenPrice | null>(async keys =>
      Promise.all(keys.map(key => this.getOneFromCache(key, filters))),
    );

    return {
      getAll: opts => this.getAllFromCache(opts, filters),
      getOne: ({ network, address }: Parameters<GetOne>[0]) => tokenDataLoader.load({ network, address }),
      getMany: async (queries: Parameters<GetMany>[0]) => {
        const docs = await tokenDataLoader.loadMany(queries);

        return docs.map(doc => {
          if (doc instanceof Error) return null;
          return doc;
        });
      },
    };
  }

  /* Internals */

  async onApplicationBootstrap() {
    try {
      await this.updateCache();
    } catch (e) {
      this.logger.error(`Could not populate local base token cache on startup ${e.message}`);
    }
  }

  private async updateCache() {
    const networks = Object.values(Network);

    await Promise.all(
      map(networks, async network => {
        const map: Map<string, BaseTokenPrice> = new Map();
        const baseTokens = await this.tokenApiClient.getAllBaseTokenPrices(network);

        baseTokens.forEach(token => map.set(token.address, token));
        this.tokenCache.set(network, map);
      }),
    );
  }
}
