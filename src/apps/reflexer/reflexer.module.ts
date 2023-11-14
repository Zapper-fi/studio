import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ReflexerViemContractFactory } from './contracts';
import { EthereumReflexerPositionPresenter } from './ethereum/reflexer.position-presenter';
import { ReflexerSafeContractPositionFetcher } from './ethereum/reflexer.safe.contract-position-fetcher';
import { ReflexerSaviorContractPositionFetcher } from './ethereum/reflexer.savior.contract-position-fetcher';

@Module({
  providers: [
    ReflexerViemContractFactory,
    EthereumReflexerPositionPresenter,
    ReflexerSafeContractPositionFetcher,
    ReflexerSaviorContractPositionFetcher,
  ],
})
export class ReflexerAppModule extends AbstractApp() {}
