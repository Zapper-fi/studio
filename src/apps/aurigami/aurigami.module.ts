import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraAurigamiBorrowContractPositionFetcher } from './aurora/aurigami.borrow.contract-position-fetcher';
import { AuroraAurigamiClaimableContractPositionFetcher } from './aurora/aurigami.claimable.contract-position-fetcher';
import { AuroraAurigamiPositionPresenter } from './aurora/aurigami.position-presenter';
import { AuroraAurigamiSupplyTokenFetcher } from './aurora/aurigami.supply.token-fetcher';
import { AurigamiContractFactory } from './contracts';

@Module({
  providers: [
    AurigamiContractFactory,
    AuroraAurigamiBorrowContractPositionFetcher,
    AuroraAurigamiClaimableContractPositionFetcher,
    AuroraAurigamiPositionPresenter,
    AuroraAurigamiSupplyTokenFetcher,
  ],
})
export class AurigamiAppModule extends AbstractApp() {}
