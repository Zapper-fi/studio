import { Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import Cache from 'file-system-cache';
import { Mutable } from 'type-fest';

import { ApiPositionSource } from '../position-source/position-source.api';

import {
  TokenDependencySelector,
  TokenDependencySelectorFactory,
  TokenDependencySelectorKey,
  CreateTokenDependencySelectorOptions,
  GetMany,
  GetOne,
  TokenDependency,
} from './token-dependency-selector.interface';

@Injectable()
export class TokenDependencySelectorService implements TokenDependencySelectorFactory {
  private cacheManager = Cache({
    basePath: './.cache',
    ns: '@CacheOnInterval',
  });

  constructor(@Inject(ApiPositionSource) private readonly positionAPIClient: ApiPositionSource) {}

  create(_opts: CreateTokenDependencySelectorOptions): TokenDependencySelector {
    const tokenDataLoader = new DataLoader<TokenDependencySelectorKey, TokenDependency | null>(
      keys => this.positionAPIClient.getTokenDependenciesBatch(keys as Mutable<TokenDependencySelectorKey[]>),
      { maxBatchSize: 1000 },
    );

    return {
      getOne: async ({ network, address }: Parameters<GetOne>[0]) => {
        const fromCache = await this.cacheManager.get(`token:${network}:${address}`);
        return (fromCache as any as TokenDependency) ?? tokenDataLoader.load({ network, address });
      },
      getMany: async (queries: Parameters<GetMany>[0]) => {
        const fromCache = await Promise.all(
          queries.map(
            async ({ network, address }) =>
              (await this.cacheManager.get(`token:${network}:${address}`)) as any as TokenDependency,
          ),
        );

        const docs = await tokenDataLoader.loadMany(queries);
        return queries.map((_, i) => {
          const element = fromCache[i] ?? docs[i];
          if (element instanceof Error) return null;
          return element;
        });
      },
    };
  }
}
