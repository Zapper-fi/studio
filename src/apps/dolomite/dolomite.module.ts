import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { Multicall } from '~contract/contracts';

import { ArbitrumDolomiteBorrowPositionsContractPositionFetcher } from './arbitrum/dolomite.borrow_positions.contract-position-fetcher';
import { ArbitrumDolomiteDolomiteBalancesSuppliedContractPositionFetcher } from './arbitrum/dolomite.dolomite_balances_supplied.contract-position-fetcher';
import { ArbitrumDolomiteDolomiteBalancesBorrowedContractPositionFetcher } from './arbitrum/dolomite.dolomite_balances_borrowed.contract-position-fetcher';
import { DolomiteContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumDolomiteBorrowPositionsContractPositionFetcher,
    ArbitrumDolomiteDolomiteBalancesSuppliedContractPositionFetcher,
    ArbitrumDolomiteDolomiteBalancesBorrowedContractPositionFetcher,
    DolomiteContractFactory,
  ],
})
export class DolomiteAppModule extends AbstractApp() {}

export const CHUNK_SIZE = 32;

export const ISOLATION_MODE_MATCHERS = ['Dolomite Isolation:', 'Dolomite: Fee + Staked GLP'];

export const SILO_MODE_MATCHERS = ['Dolomite Silo:'];

export const SPECIAL_TOKEN_NAME_MATCHERS = [...ISOLATION_MODE_MATCHERS, ...SILO_MODE_MATCHERS];

export const DOLOMITE_MARGIN_ADDRESSES = {
  arbitrum: '0x6bd780e7fdf01d77e4d475c821f1e7ae05409072',
};

export function chunkArrayForMultiCall<T>(
  values: T[],
  getCallData: (value: T, index: number) => { target: string; callData: string },
): Multicall.CallStruct[][] {
  const callChunks: Multicall.CallStruct[][] = [];
  let index = 0;
  for (let i = 0; i < values.length; i += CHUNK_SIZE) {
    callChunks[i] = [];
    for (let j = 0; j < CHUNK_SIZE && index < values.length; j++) {
      callChunks[i / CHUNK_SIZE].push(getCallData(values[i + j], i + j));
      index += 1;
    }
  }
  return callChunks;
}
