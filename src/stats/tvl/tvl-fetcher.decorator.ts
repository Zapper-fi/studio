import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import moment from 'moment';

import { CacheOnIntervalBuilder } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { TvlFetcher as ITvlFetcher } from './tvl-fetcher.interface';

export const TVL_FETCHER_APP = 'TVL_FETCHER_APP';
export const TVL_FETCHER_NETWORK = 'TVL_FETCHER_NETWORK';

export const buildTvlCacheKey = (opts: { network: Network; appId: string }) =>
  `tvl-fetcher-result:${opts.appId}:${opts.network}`;

export const TvlFetcher = ({ appId, network }: { appId: string; network: Network }) => {
  return applyDecorators(
    SetMetadata(TVL_FETCHER_APP, appId),
    SetMetadata(TVL_FETCHER_NETWORK, network),
    CacheOnIntervalBuilder<ITvlFetcher>({
      targetMethod: 'getTvl',
      key: buildTvlCacheKey({ appId, network }),
      timeout: moment.duration(600, 'seconds').asMilliseconds(),
      failOnMissingData: process.env.NODE_ENV === 'production',
    }),
    Injectable,
  );
};
