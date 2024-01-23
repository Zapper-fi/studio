import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EthereumUnlockdFinancePositionPresenter } from './ethereum/unlockd-finance.position-presenter';

@Module({
  providers: [EthereumUnlockdFinancePositionPresenter],
})
export class UnlockdFinanceAppModule extends AbstractApp() {}
