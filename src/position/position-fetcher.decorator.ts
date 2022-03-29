import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

import { ContractType } from '~position/contract.interface';
import { Network } from '~types/network.interface';

export const POSITION_FETCHER_APP = 'POSITION_FETCHER_APP';
export const POSITION_FETCHER_GROUP = 'POSITION_FETCHER_GROUP';
export const POSITION_FETCHER_NETWORK = 'POSITION_FETCHER_NETWORK';
export const POSITION_FETCHER_TYPE = 'POSITION_FETCHER_TYPE';

export const PositionFetcher =
  (type: ContractType) =>
  ({ appId, groupId, network }: { appId: string; groupId: string; network: Network }) => {
    return applyDecorators(
      SetMetadata(POSITION_FETCHER_APP, appId),
      SetMetadata(POSITION_FETCHER_GROUP, groupId),
      SetMetadata(POSITION_FETCHER_NETWORK, network),
      SetMetadata(POSITION_FETCHER_TYPE, type),
      Injectable,
    );
  };
