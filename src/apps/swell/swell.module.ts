import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SwellContractFactory } from './contracts';
import { EthereumSwellSwethTokenFetcher } from './ethereum/swell.sweth.token-fetcher';

@Module({
  providers: [EthereumSwellSwethTokenFetcher, SwellContractFactory],
})
export class SwellAppModule extends AbstractApp() {}
