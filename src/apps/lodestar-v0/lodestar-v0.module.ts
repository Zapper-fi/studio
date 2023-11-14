import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumLodestarV0BorrowContractPositionFetcher } from './arbitrum/lodestar-v0.borrow.contract-position-fetcher';
import { ArbitrumLodestarV0ClaimableContractPositionFetcher } from './arbitrum/lodestar-v0.claimable.contract-position-fetcher';
import { ArbitrumLodestarV0PositionPresenter } from './arbitrum/lodestar-v0.position-presenter';
import { ArbitrumLodestarV0SupplyTokenFetcher } from './arbitrum/lodestar-v0.supply.token-fetcher';
import { LodestarV0ViemContractFactory } from './contracts';

@Module({
  providers: [
    LodestarV0ViemContractFactory,
    // Arbitrum
    ArbitrumLodestarV0BorrowContractPositionFetcher,
    ArbitrumLodestarV0PositionPresenter,
    ArbitrumLodestarV0SupplyTokenFetcher,
    ArbitrumLodestarV0ClaimableContractPositionFetcher,
  ],
})
export class LodestarV0AppModule extends AbstractApp() {}
