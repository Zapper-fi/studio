import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LooksRareContractFactory } from './contracts';
import { EthereumLooksRareCompounderContractPositionFetcher } from './ethereum/looks-rare.compounder.contract-position-fetcher';
import { EthereumLooksRareFarmContractPositionFetcher } from './ethereum/looks-rare.farm.contract-position-fetcher';
import { LooksRareAppDefinition } from './looks-rare.definition';

@Module({
  providers: [
    LooksRareContractFactory,
    EthereumLooksRareFarmContractPositionFetcher,
    EthereumLooksRareCompounderContractPositionFetcher,
  ],
})
export class LooksRareAppModule extends AbstractApp() {}
