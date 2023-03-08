import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SideshiftContractFactory } from './contracts';
import { EthereumSideshiftSvxaiTokenFetcher } from './ethereum/sideshift.svxai.token-fetcher';

@Module({
  providers: [EthereumSideshiftSvxaiTokenFetcher, SideshiftContractFactory],
})
export class SideshiftAppModule extends AbstractApp() {}
