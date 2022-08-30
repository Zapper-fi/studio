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
      keys => this.apiPositionSource.getTokenDependenciesBatch(keys as Mutable<TokenDependencySelectorKey[]>),
      { maxBatchSize: 1000 },
    );

    return {
      getOne: async ({ network, address }: Parameters<GetOne>[0]) => {
        const fromCache = await this.registryPositionSource.getTokenDependenciesBatch([{ network, address }]);
        const fromApi = await tokenDataLoader.load({ network, address });
        return fromCache[0] ?? fromApi;
      },
      getMany: async (queries: Parameters<GetMany>[0]) => {
        const fromCache = await this.registryPositionSource.getTokenDependenciesBatch(queries);
        const fromApi = await tokenDataLoader.loadMany(queries);

        return queries.map((_, i) => {
          const element = fromCache[i] ?? fromApi[i];
          if (element instanceof Error) return null;
          return element;
        });
      },
    };
  }
}
