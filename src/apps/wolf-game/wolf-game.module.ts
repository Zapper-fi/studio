import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { WolfGameContractFactory } from './contracts';
import { EthereumWolfGameWoolPouchContractPositionFetcher } from './ethereum/wolf-game.wool-pouch.contract-position-fetcher';

@Module({
  providers: [WolfGameContractFactory, EthereumWolfGameWoolPouchContractPositionFetcher],
})
export class WolfGameAppModule extends AbstractApp() {}
