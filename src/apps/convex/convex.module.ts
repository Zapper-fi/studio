import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CONVEX_ARBITRUM_PROVIDERS } from './arbitrum';
import { ConvexContractFactory } from './contracts';
import { CONVEX_ETHEREUM_PROVIDERS } from './ethereum';
import { CONVEX_POLYGON_PROVIDERS } from './polygon';

@Module({
  providers: [
    ConvexContractFactory,
    ...CONVEX_ARBITRUM_PROVIDERS,
    ...CONVEX_ETHEREUM_PROVIDERS,
    ...CONVEX_POLYGON_PROVIDERS,
  ],
})
export class ConvexAppModule extends AbstractApp() {}
