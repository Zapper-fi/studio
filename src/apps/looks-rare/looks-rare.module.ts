import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LooksRareViemContractFactory } from './contracts';
import { EthereumLooksRareCompounderContractPositionFetcher } from './ethereum/looks-rare.compounder.contract-position-fetcher';
import { EthereumLooksRareFarmContractPositionFetcher } from './ethereum/looks-rare.farm.contract-position-fetcher';

@Module({
  providers: [
    LooksRareViemContractFactory,
    EthereumLooksRareFarmContractPositionFetcher,
    EthereumLooksRareCompounderContractPositionFetcher,
  ],
})
export class LooksRareAppModule extends AbstractApp() {}
