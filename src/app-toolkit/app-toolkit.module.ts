import { Module } from '@nestjs/common';

import { NetworkProviderModule } from '~network-provider/network-provider.module';
import { PositionModule } from '~position/position.module';
import { TokenModule } from '~token/token.module';

import { AppToolkitHelperRegistry, AppToolkitHelpers } from './app-toolkit.helpers';
import { APP_TOOLKIT } from './app-toolkit.interface';
import { AppToolkit } from './app-toolkit.service';

@Module({
  imports: [NetworkProviderModule, TokenModule, PositionModule],
  providers: [{ provide: APP_TOOLKIT, useClass: AppToolkit }, AppToolkitHelperRegistry, ...AppToolkitHelpers],
  exports: [APP_TOOLKIT, ...AppToolkitHelpers],
})
export class AppToolkitModule {}
