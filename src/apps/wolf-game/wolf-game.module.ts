import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { WolfGameViemContractFactory } from './contracts';
import { EthereumWolfGameWoolPouchContractPositionFetcher } from './ethereum/wolf-game.wool-pouch.contract-position-fetcher';

@Module({
  providers: [WolfGameViemContractFactory, EthereumWolfGameWoolPouchContractPositionFetcher],
})
export class WolfGameAppModule extends AbstractApp() {}
