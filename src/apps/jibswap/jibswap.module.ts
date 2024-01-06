import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { JibswapContractFactory } from './contracts';

@Module({
  providers: [JibswapContractFactory],
})
export class JibswapAppModule extends AbstractApp() {}
