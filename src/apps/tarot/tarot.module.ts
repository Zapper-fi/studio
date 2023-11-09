import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { TarotViemContractFactory } from './contracts';
import { FantomTarotBorrowContractPositionFetcher } from './fantom/tarot.borrow.contract-position-fetcher';
import { FantomTarotSupplyTokenFetcher } from './fantom/tarot.supply.token-fetcher';
import { FantomTarotVaultTokenFetcher } from './fantom/tarot.vault.token-fetcher';

@Module({
  providers: [
    TarotContractFactory,
    FantomTarotBorrowContractPositionFetcher,
    FantomTarotSupplyTokenFetcher,
    FantomTarotVaultTokenFetcher,
  ],
})
export class TarotAppModule extends AbstractApp() {}
