import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SpiceFinanceContractFactory } from './contracts';

@Module({
  providers: [SpiceFinanceContractFactory],
})
export class SpiceFinanceAppModule extends AbstractApp() {}
