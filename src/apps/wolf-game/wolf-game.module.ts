import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { WolfGameContractFactory } from './contracts';
import { EthereumWolfGameWoolPouchContractPositionFetcher } from './ethereum/wolf-game.wool-pouch.contract-position-fetcher';
import { WolfGameAppDefinition } from './wolf-game.definition';

@Module({
  providers: [WolfGameAppDefinition, WolfGameContractFactory, EthereumWolfGameWoolPouchContractPositionFetcher],
})
export class WolfGameAppModule extends AbstractApp() {}
