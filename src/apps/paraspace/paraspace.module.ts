import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ParaspaceContractFactory } from './contracts';
import { EthereumParaspaceAutoCompoundApeTokenFetcher } from './ethereum/paraspace.auto-compound-ape.token-fetcher';
import { EthereumParaspaceBorrowTokenFetcher } from './ethereum/paraspace.borrow.token-fetcher';
import { EthereumParaspaceSupplyTokenFetcher } from './ethereum/paraspace.supply.token-fetcher';

@Module({
  providers: [
    EthereumParaspaceAutoCompoundApeTokenFetcher,
    EthereumParaspaceBorrowTokenFetcher,
    EthereumParaspaceSupplyTokenFetcher,
    ParaspaceContractFactory,
  ],
})
export class ParaspaceAppModule extends AbstractApp() {}
