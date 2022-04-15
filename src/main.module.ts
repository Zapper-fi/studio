import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppsModule } from '~apps/apps.module';
import { BalanceModule } from '~balance/balance.module';
import { CacheModule } from '~cache/cache.module';
import { StatsModule } from '~stats/stats.module';

@Module({
  imports: [
    AppsModule.registerAsync({ appToolkitModule: AppToolkitModule }),
    CacheModule,
    AppToolkitModule,
    StatsModule,
    BalanceModule,
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
})
export class MainModule {}
