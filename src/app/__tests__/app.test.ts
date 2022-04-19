import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import qs from 'qs';

import { AppModule } from '~app/app.module';

describe('Studio Integration Tests', () => {
  test(
    'resolves all the modules when booting the app',
    async () => {
      await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter({
          logger: false,
          querystringParser: (str: string) => qs.parse(str),
          trustProxy: true,
        }),
      );
    },
    30 * 1000,
  );
});
