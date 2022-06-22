import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

import { CacheOnIntervalBuilder } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';
import { PositionFetcher as IPositionFetcher } from './position-fetcher.interface';
import { Position } from './position.interface';

export const POSITION_FETCHER_APP = 'POSITION_FETCHER_APP';
export const POSITION_FETCHER_GROUP = 'POSITION_FETCHER_GROUP';
export const POSITION_FETCHER_NETWORK = 'POSITION_FETCHER_NETWORK';
export const POSITION_FETCHER_TYPE = 'POSITION_FETCHER_TYPE';
export const POSITION_FETCHER_OPTIONS = 'POSITION_FETCHER_OPTIONS';

export type PositionOptions = {
  includeInTvl?: boolean;
};

export const buildAppPositionsCacheKey = (opts: {
  type: ContractType;
  network: Network;
  appId: string;
  groupId: string;
}) => `apps-v3:${opts.type}:${opts.network}:${opts.appId}:${opts.groupId}`;

export const PositionFetcher =
  (type: ContractType) =>
  ({
    appId,
    groupId,
    network,
    options = {},
  }: {
    appId: string;
    groupId: string;
    network: Network;
    options?: PositionOptions;
  }) => {
    return applyDecorators(
      SetMetadata(POSITION_FETCHER_APP, appId),
      SetMetadata(POSITION_FETCHER_GROUP, groupId),
      SetMetadata(POSITION_FETCHER_NETWORK, network),
      SetMetadata(POSITION_FETCHER_TYPE, type),
      SetMetadata(POSITION_FETCHER_OPTIONS, options),
      CacheOnIntervalBuilder<IPositionFetcher<Position>>({
        targetMethod: 'getPositions',
        key: buildAppPositionsCacheKey({ type, network, appId, groupId }),
        timeout: process.env.NODE_ENV === 'production' ? 45 * 1000 : 45 * 1000,
        failOnMissingData: process.env.NODE_ENV === 'production',
      }),
      Injectable,
    );
  };
