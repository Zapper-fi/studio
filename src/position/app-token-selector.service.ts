import { Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Mutable } from 'type-fest';

import { AppTokenPosition } from '~position/position.interface';

import {
  AppTokenSelector,
  AppTokenSelectorFactory,
  AppTokenSelectorKey,
  CreateAppTokenSelectorOptions,
  GetMany,
  GetOne,
} from './app-token-selector.interface';
import { ApiPositionSource } from './position-source/position-source.api';

@Injectable()
export class AppTokenSelectorService implements AppTokenSelectorFactory {
  constructor(@Inject(ApiPositionSource) private readonly positionAPIClient: ApiPositionSource) {}

  create(_opts: CreateAppTokenSelectorOptions): AppTokenSelector {
    const tokenDataLoader = new DataLoader<AppTokenSelectorKey, AppTokenPosition | null>(
      keys => this.positionAPIClient.getAppTokenBatch(keys as Mutable<AppTokenSelectorKey[]>),
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
