import path from 'path';

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppsModule } from '~apps/apps.module';
import { AppTokenPosition } from '~position/position.interface';

import { getAllAppTokenFetchers } from './common';

require('jest-specific-snapshot');

describe.only('App Token Fetchers', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    if (process.env.APP_BASE_URL) {
      request = supertest(process.env.APP_BASE_URL);
      return;
    }

    moduleRef = await Test.createTestingModule({
      imports: [
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
        // @TODO: Pass in the files changed according to Git
        AppsModule.registerAsync({ appToolkitModule: AppToolkitModule }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    request = supertest(app.getHttpServer());
  }, 30 * 1000);

  afterAll(async () => {
    await moduleRef.close();
  });

  describe.each(getAllAppTokenFetchers().slice(0, 3))(`(%s, %s, %s) positions`, (appId, network, groupId) => {
    let results: AppTokenPosition[];

    beforeAll(async () => {
      const prodUrl = `/v2/apps/${appId}/tokens?groupId=${groupId}&network=${network}`;
      const localUrl = `/apps/${appId}/tokens?groupIds[]=${groupId}&network=${network}`;

      const response = await request
        .get(prodUrl)
        .set('Authorization', `Basic ${Buffer.from('ad01527e-8133-4a68-ad67-fbf8d9040ad1:').toString('base64')}`);
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
