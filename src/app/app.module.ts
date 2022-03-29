import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppsModule } from '~apps/apps.module';
import { CacheModule } from '~cache/cache.module';

import { AppController } from './app.controller';
import { AppRegistry } from './app.registry';
import { AppService } from './app.service';
import { AppBalanceFetcherRegistry } from './balance-fetcher.registry';

@Module({
  imports: [
    AppsModule.registerAsync(),
    CacheModule,
    DiscoveryModule,
    AppToolkitModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          zapperApi: {
            url: process.env.ZAPPER_API_URL ?? 'https://api.zapper.fi',
            key: process.env.ZAPPER_API_KEY ?? '96e0cc51-a62e-42ca-acee-910ea7d2a241',
          },
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppRegistry, AppBalanceFetcherRegistry],
})
export class AppModule {}
