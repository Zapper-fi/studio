import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppsModule } from '~apps/apps.module';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { getAllAppIds, getAllAppTokenFetchers, getChangedAppIds, getChangedAppTokenFetchers } from './common';

export class TestHarness {
  moduleRef: TestingModule;
  app: INestApplication;
  request: supertest.SuperTest<supertest.Test>;

  get baseUrl() {
    return process.env.ZAPPER_API_URL ?? 'https://api.zapper.fi';
  }

  get apiKey() {
    return process.env.ZAPPER_API_KEY ?? 'ad01527e-8133-4a68-ad67-fbf8d9040ad1';
  }

  get changedAppsOnly() {
    return process.env.POSITION_FETCHERS_TEST_CHANGED_ONLY === 'true';
  }

  get useProduction() {
    return process.env.POSITION_FETCHERS_TEST_USE_PRODUCTION === 'true';
  }

  getAppsUnderTest() {
    return this.changedAppsOnly ? getChangedAppIds() : getAllAppIds();
  }

  getAppTokenFetchersUnderTest() {
    return this.changedAppsOnly ? getChangedAppTokenFetchers() : getAllAppTokenFetchers();
  }

  async getAppTokens({ appId, groupId, network }: { appId: string; groupId: string; network: Network }) {
    const zapperApiPositionsRoute = `/v2/apps/${appId}/tokens?groupId=${groupId}&network=${network}`;
    const studioApiPositionsRoute = `/apps/${appId}/tokens?groupIds[]=${groupId}&network=${network}`;
    const route = this.useProduction ? zapperApiPositionsRoute : studioApiPositionsRoute;

    const auth = `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`;
    const res = await this.request.get(route).set('Authorization', auth);

    return res.body as AppTokenPosition[];
  }

  async setup() {
    // If a test URL is set, use the remote
    if (this.useProduction) {
      this.request = supertest(this.baseUrl);
      return;
    }

    // Otherwise, initialize a local instance of the application
    const testModule = Test.createTestingModule({
      imports: [
        AppsModule.registerAsync({
          enabledAppIds: this.getAppsUnderTest(),
          appToolkitModule: AppToolkitModule,
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              zapperApi: {
                url: this.baseUrl,
                key: this.apiKey,
              },
            }),
          ],
        }),
      ],
    });

    this.moduleRef = await testModule.compile();
    this.app = await this.moduleRef.createNestApplication().init();
    this.request = supertest(this.app.getHttpServer());
  }

  async teardown() {
    if (this.app) await this.app.close();
  }
}
