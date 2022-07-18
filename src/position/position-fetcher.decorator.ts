import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';

export const POSITION_FETCHER_APP = 'POSITION_FETCHER_APP';
export const POSITION_FETCHER_GROUP = 'POSITION_FETCHER_GROUP';
export const POSITION_FETCHER_NETWORK = 'POSITION_FETCHER_NETWORK';
export const POSITION_FETCHER_TYPE = 'POSITION_FETCHER_TYPE';
export const POSITION_FETCHER_OPTIONS = 'POSITION_FETCHER_OPTIONS';

export type PositionOptions = {
  excludeFromTvl?: boolean;
};

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
      Injectable,
    );
  };
