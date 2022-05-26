import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

import { Network } from '~types/network.interface';

export const BALANCE_AFTERWARE_APP = 'BALANCE_AFTERWARE_PROTOCOL';
export const BALANCE_AFTERWARE_NETWORK = 'BALANCE_AFTERWARE_NETWORK';
export const BALANCE_AFTERWARE = 'BALANCE_AFTERWARE';

export function BalanceAfterware({ appId, network }: { appId: string; network: Network }) {
  return applyDecorators(
    SetMetadata(BALANCE_AFTERWARE, true),
    SetMetadata(BALANCE_AFTERWARE_APP, appId),
    SetMetadata(BALANCE_AFTERWARE_NETWORK, network),
    Injectable,
  );
}
