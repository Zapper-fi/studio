import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUnstoppableGlpCompounderTokenFetcher } from './arbitrum/unstoppable.glp-compounder.token-fetcher';
import { UnstoppableContractFactory } from './contracts';

@Module({
  providers: [ArbitrumUnstoppableGlpCompounderTokenFetcher, UnstoppableContractFactory],
})
export class UnstoppableAppModule extends AbstractApp() { }
