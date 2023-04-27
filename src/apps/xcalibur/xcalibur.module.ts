import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumXcaliburPoolTokenFetcher } from './arbitrum/xcalibur.pool.token-fetcher';
import { XcaliburContractFactory } from './contracts';

@Module({
  providers: [ArbitrumXcaliburPoolTokenFetcher, XcaliburContractFactory],
})
export class XcaliburAppModule extends AbstractApp() {}
