import { Module } from '@nestjs/common';

import { AppModule } from '~app/app.module';
import { MulticallModule } from '~multicall/multicall.module';
import { NetworkProviderModule } from '~network-provider/network-provider.module';
import { PositionModule } from '~position/position.module';
import { TokenModule } from '~token/token.module';

import { APP_TOOLKIT } from './app-toolkit.interface';
import { AppToolkit } from './app-toolkit.service';

@Module({
  imports: [NetworkProviderModule, TokenModule, PositionModule, MulticallModule, AppModule],
  providers: [{ provide: APP_TOOLKIT, useClass: AppToolkit }],
  exports: [APP_TOOLKIT],
})
export class AppToolkitModule {}
