import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import DataLoader from 'dataloader';
import Cache from 'file-system-cache';
import { isNil, map } from 'lodash';
import moment from 'moment';

import { Network } from '~types';

import { TokenApiClient } from './token-api.client';
import {
  BaseTokenPrice,
  CreatePriceSelectorOptions,
  Filters,
  GetAll,
  GetOne,
  PriceSelector,
  PriceSelectorFactory,
} from './token-price-selector.interface';

type TokenDataLoaderKey = { network: Network; address: string };

@Injectable()
export class PriceSelectorService implements PriceSelectorFactory {
  private logger = new Logger(PriceSelectorService.name);
  private cacheManager = Cache({
    basePath: './.cache',
    ns: 'price-selector',
  });

  constructor(@Inject(TokenApiClient) private readonly tokenApiClient: TokenApiClient) {}

  private getCacheKey(network: Network) {
    return `$tokens:${network}`;
  }

  private async getCachedNetworkTokens(network: Network) {
    const tokenMap = (await this.cacheManager.get(this.getCacheKey(network))) as unknown as Record<
      string,
      BaseTokenPrice
    >;
    if (!tokenMap) throw new Error(`Could not retrieve "${network}" tokens from cache`);
    return tokenMap;
  }

  private async getAllFromCache({ network }: Parameters<GetAll>[0], filters: Filters = {}) {
    const cacheTokenMap = await this.getCachedNetworkTokens(network);
    const tokens = Object.values(cacheTokenMap);

    return tokens.filter(t => {
      if (!isNil(filters.exchangeable) && filters.exchangeable !== t.canExchange) return false;
      if (!isNil(filters.hidden) && filters.hidden !== t.hide) return false;
      return true;
    });
  }

  private async getOneFromCache({ network, address }: Parameters<GetOne>[0], filters: Filters = {}) {
    const cacheTokenMap = await this.getCachedNetworkTokens(network);
    const match = cacheTokenMap[address];

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
      getOne: ({ network, address }: Parameters<GetOne>[0]) => {
        return tokenDataLoader.load({ network, address });
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

  @Interval(moment.duration(2, 'minutes').asMilliseconds())
  private async updateCache() {
    const networks = Object.values(Network);

    await Promise.all(
      map(networks, async network => {
        const map: Record<string, BaseTokenPrice> = {};
        const baseTokens = await this.tokenApiClient.getAllBaseTokenPrices(network);

        baseTokens.forEach(token => {
          map[token.address] = token;
        });

        await this.cacheManager.set(this.getCacheKey(network), map as any);
      }),
    );
  }
}
