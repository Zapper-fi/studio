import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

import { Network } from '~types/network.interface';

export const BALANCE_FETCHER_PROTOCOL = 'BALANCE_FETCHER_PROTOCOL';
export const BALANCE_FETCHER_NETWORK = 'BALANCE_FETCHER_NETWORK';
export const BALANCE_FETCHER_V3 = 'BALANCE_FETCHER_V3';

export function BalanceFetcher(appId: string, network: Network) {
  return applyDecorators(
    SetMetadata(BALANCE_FETCHER_V3, true),
    SetMetadata(BALANCE_FETCHER_PROTOCOL, appId),
    SetMetadata(BALANCE_FETCHER_NETWORK, network),
    Injectable,
  );
}
