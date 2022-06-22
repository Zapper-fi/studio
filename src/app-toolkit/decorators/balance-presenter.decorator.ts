import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

import { Network } from '~types/network.interface';

export const BALANCE_PRESENTER_APP = 'BALANCE_PRESENTER_PROTOCOL';
export const BALANCE_PRESENTER_NETWORK = 'BALANCE_PRESENTER_NETWORK';

export function BalancePresenter({ appId, network }: { appId: string; network: Network }) {
  return applyDecorators(
    SetMetadata(BALANCE_PRESENTER_APP, appId),
    SetMetadata(BALANCE_PRESENTER_NETWORK, network),
    Injectable,
  );
}
