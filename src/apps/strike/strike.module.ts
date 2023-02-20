import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { StrikeContractFactory } from './contracts';
import { EthereumStrikeBorrowContractPositionFetcher } from './ethereum/strike.borrow.contract-position-fetcher';
import { EthereumStrikePositionPresenter } from './ethereum/strike.position-presenter';
import { EthereumStrikeSupplyTokenFetcher } from './ethereum/strike.supply.token-fetcher';

@Module({
  providers: [
    StrikeContractFactory,
    EthereumStrikePositionPresenter,
    EthereumStrikeBorrowContractPositionFetcher,
    EthereumStrikeSupplyTokenFetcher,
  ],
})
export class StrikeAppModule extends AbstractApp() {}
