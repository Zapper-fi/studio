import { Module } from '@nestjs/common';

import { NetworkProviderModule } from '~network-provider/network-provider.module';
import { PositionModule } from '~position/position.module';
import { TokenModule } from '~token/token.module';

import { AppToolkitHelperRegistry, AppToolkitHelpers } from './app-toolkit.helpers';
import { AppToolkit } from './app-toolkit.service';

@Module({
  imports: [NetworkProviderModule, TokenModule, PositionModule],
  providers: [AppToolkit, AppToolkitHelperRegistry, ...AppToolkitHelpers],
  exports: [AppToolkit],
})
export class AppToolkitModule {}
