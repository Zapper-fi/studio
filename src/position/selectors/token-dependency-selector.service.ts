import { Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
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
  constructor(@Inject(ApiPositionSource) private readonly positionAPIClient: ApiPositionSource) {}

  create(_opts: CreateTokenDependencySelectorOptions): TokenDependencySelector {
    const tokenDataLoader = new DataLoader<TokenDependencySelectorKey, TokenDependency | null>(
      keys => this.positionAPIClient.getTokenDependenciesBatch(keys as Mutable<TokenDependencySelectorKey[]>),
      { maxBatchSize: 1000 },
    );

    return {
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
}
