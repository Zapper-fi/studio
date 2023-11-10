import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SideshiftViemContractFactory } from './contracts';
import { EthereumSideshiftSvxaiTokenFetcher } from './ethereum/sideshift.svxai.token-fetcher';

@Module({
  providers: [EthereumSideshiftSvxaiTokenFetcher, SideshiftViemContractFactory],
})
export class SideshiftAppModule extends AbstractApp() {}
