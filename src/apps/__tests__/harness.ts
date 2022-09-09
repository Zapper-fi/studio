import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

export class TestHarness {
  moduleRef: TestingModule;
  app: INestApplication;
  request: supertest.SuperTest<supertest.Test>;

  async setup() {
    const testModule = Test.createTestingModule({
      imports: [
        // AppsModule.registerAsync({
        //   appToolkitModule: AppToolkitModule,
        // }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              zapperApi: {
                url: process.env.ZAPPER_API_URL ?? 'https://api.zapper.fi',
                key: process.env.ZAPPER_API_KEY ?? 'ad01527e-8133-4a68-ad67-fbf8d9040ad1',
              },
            }),
          ],
        }),
      ],
    });

    this.moduleRef = await testModule.compile();
    // this.app = await this.moduleRef.createNestApplication().init();
    // this.request = supertest(this.app.getHttpServer());
  }

  async teardown() {
    if (this.app) await this.app.close();
  }
}
