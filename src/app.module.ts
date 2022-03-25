import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
