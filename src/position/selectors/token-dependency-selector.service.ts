import { Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Mutable } from 'type-fest';

import { ApiPositionSource } from '~position/position-source/position-source.api';
import { RegistryPositionSource } from '~position/position-source/position-source.registry';

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
  constructor(
    @Inject(RegistryPositionSource) private readonly registryPositionSource: RegistryPositionSource,
    @Inject(ApiPositionSource) private readonly apiPositionSource: ApiPositionSource,
  ) {}

  create(_opts: CreateTokenDependencySelectorOptions): TokenDependencySelector {
    const tokenDataLoader = new DataLoader<TokenDependencySelectorKey, TokenDependency | null>(
      async (keys: Mutable<TokenDependencySelectorKey[]>) => {
        const [fromCache, fromApi] = await Promise.all([
          this.registryPositionSource.getTokenDependenciesBatch(keys),
          this.apiPositionSource.getTokenDependenciesBatch(keys),
        ]);

        return keys.map((_key, idx) => fromCache[idx] ?? fromApi[idx] ?? null);
      },
      { maxBatchSize: 1000 },
    );

    return {
      getOne: async (key: Parameters<GetOne>[0]) => tokenDataLoader.load(key),
      getMany: async (queries: Parameters<GetMany>[0]) => {
        const docs = await tokenDataLoader.loadMany(queries);
        return docs.map(doc => {
          if (doc instanceof Error) return null;
          return doc;
        });
      },
    };
  }
}
