import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { Cryptexv2ContractFactory } from './contracts';

@Module({
  providers: [Cryptexv2ContractFactory],
})
export class Cryptexv2AppModule extends AbstractApp() {}
