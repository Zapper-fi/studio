import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CONVEX_ARBITRUM_PROVIDERS } from './arbitrum';
import { ConvexContractFactory } from './contracts';
import { ConvexAppDefinition } from './convex.definition';
import { CONVEX_ETHEREUM_PROVIDERS } from './ethereum';

@Module({
  providers: [ConvexContractFactory, ...CONVEX_ARBITRUM_PROVIDERS, ...CONVEX_ETHEREUM_PROVIDERS],
})
export class ConvexAppModule extends AbstractApp() {}
