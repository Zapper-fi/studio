import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { compact } from 'lodash';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppsModule } from '~apps/apps.module';
import { BalanceModule } from '~balance/balance.module';
import { CacheModule } from '~cache/cache.module';
import { SchedulerModule } from '~scheduler/scheduler.module';
import { StatsModule } from '~stats/stats.module';

@Module({
  imports: [
    AppsModule.registerAsync({ appToolkitModule: AppToolkitModule }),
    CacheModule,
    SchedulerModule,
    AppToolkitModule,
    StatsModule,
    BalanceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          zapperApi: {
            url: process.env.ZAPPER_API_URL ?? 'https://api.zapper.fi',
            key: process.env.ZAPPER_API_KEY ?? 'ad01527e-8133-4a68-ad67-fbf8d9040ad1',
          },
          apiResolvedPositions: compact((process.env.API_RESOLVED_POSITIONS ?? '').split(',')),
        }),
      ],
    }),
  ],
})
export class MainModule {}
