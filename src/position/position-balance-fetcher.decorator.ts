import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';

export const POSITION_BALANCE_FETCHER_TYPE = 'POSITION_BALANCE_FETCHER_TYPE';
export const POSITION_BALANCE_FETCHER_NETWORK = 'POSITION_BALANCE_FETCHER_NETWORK';
export const POSITION_BALANCE_FETCHER_APP = 'POSITION_BALANCE_FETCHER_PROTOCOL';
export const POSITION_BALANCE_FETCHER_GROUP = 'POSITION_BALANCE_FETCHER_GROUP';

export const PositionBalanceFetcher =
  (type: ContractType) =>
  ({ appId, groupId, network }: { network: Network; appId: string; groupId: string }) => {
    return applyDecorators(
      SetMetadata(POSITION_BALANCE_FETCHER_TYPE, type),
      SetMetadata(POSITION_BALANCE_FETCHER_NETWORK, network),
      SetMetadata(POSITION_BALANCE_FETCHER_APP, appId),
      SetMetadata(POSITION_BALANCE_FETCHER_GROUP, groupId),
      Injectable,
    );
  };
