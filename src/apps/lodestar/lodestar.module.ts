import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumLodestarBorrowContractPositionFetcher } from './arbitrum/lodestar.borrow.contract-position-fetcher';
import { ArbitrumLodestarClaimableContractPositionFetcher } from './arbitrum/lodestar.claimable.contract-position-fetcher';
import { ArbitrumLodestarPositionPresenter } from './arbitrum/lodestar.position-presenter';
import { ArbitrumLodestarSupplyTokenFetcher } from './arbitrum/lodestar.supply.token-fetcher';
import { LodestarContractFactory } from './contracts';

@Module({
  providers: [
    LodestarContractFactory,
    // Arbitrum
    ArbitrumLodestarBorrowContractPositionFetcher,
    ArbitrumLodestarPositionPresenter,
    ArbitrumLodestarSupplyTokenFetcher,
    ArbitrumLodestarClaimableContractPositionFetcher,
  ],
})
export class LodestarAppModule extends AbstractApp() {}
