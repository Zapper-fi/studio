import path from 'path';

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppsModule } from '~apps/apps.module';
import { AppTokenPosition } from '~position/position.interface';

import { getAllAppTokenFetchers, getChangedAppIds, getChangedAppTokenFetchers } from './common';

require('jest-specific-snapshot');

const apiUrl = process.env.ZAPPER_API_URL ?? 'https://api.zapper.fi';
const apiKey = process.env.ZAPPER_API_KEY ?? 'ad01527e-8133-4a68-ad67-fbf8d9040ad1';
const recordMode = process.env.MODE === 'record';
const fetchersUnderTest = recordMode ? getAllAppTokenFetchers() : getChangedAppTokenFetchers();

describe.only('App Token Fetchers', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    if (recordMode) {
      request = supertest(apiUrl);
      return;
    }

    process.env.ENABLED_APPS = getChangedAppIds().join(',');
    moduleRef = await Test.createTestingModule({
      imports: [
        AppsModule.registerAsync({ appToolkitModule: AppToolkitModule }),
        ConfigModule.forRoot({ isGlobal: true, load: [() => ({ zapperApi: { url: apiUrl, key: apiKey } })] }),
      ],
    }).compile();

    app = await moduleRef.createNestApplication().init();
    request = supertest(app.getHttpServer());
  }, 30 * 1000);

  afterAll(async () => {
    if (app) await app.close();
  });

  describe.each(fetchersUnderTest)(`(%s, %s, %s) positions`, (appId, network, groupId) => {
    let results: AppTokenPosition[];

    beforeAll(async () => {
      const prodUrl = `/v2/apps/${appId}/tokens?groupId=${groupId}&network=${network}`;
      const localUrl = `/apps/${appId}/tokens?groupIds[]=${groupId}&network=${network}`;

      const response = await request
        .get(recordMode ? prodUrl : localUrl)
        .set('Authorization', `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`);
      results = response.body;
    });

    it('should all have the same appId, groupId, and network', () => {
      expect(results.every(v => v.appId === appId)).toBe(true);
      expect(results.every(v => v.groupId === groupId)).toBe(true);
      expect(results.every(v => v.network === network)).toBe(true);
    });

    it('should have structure', () => {
      const id = [appId, network, groupId].join('_');
      const pathToSnap = path.resolve(__dirname, `./__snapshots__/${id}.app-token.shot`);

      // Extract static part of the tokens structure
      const structures = results.map(v => ({
        key: v.key,
        address: v.address,
        tokens: v.tokens.map(t => t.address),
        symbol: v.symbol,
        decimals: v.decimals,
      }));

      expect(structures).toMatchSpecificSnapshot(pathToSnap);
    });
  });
});
