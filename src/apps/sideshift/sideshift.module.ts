import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SideshiftContractFactory } from './contracts';
import { EthereumSideshiftSvxaiTokenFetcher } from './ethereum/sideshift.svxai.token-fetcher';
import { SideshiftAppDefinition } from './sideshift.definition';

@Module({
  providers: [EthereumSideshiftSvxaiTokenFetcher, SideshiftAppDefinition, SideshiftContractFactory],
})
export class SideshiftAppModule extends AbstractApp() {}
