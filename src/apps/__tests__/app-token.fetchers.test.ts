import path from 'path';

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppsModule } from '~apps/apps.module';
import { ContractType } from '~position/contract.interface';
import { PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { PriceSelectorService } from '~token/selectors/token-price-selector.service';

import { getAllAppTokenFetchers } from './common';

require('jest-specific-snapshot');

describe.only('App Token Fetchers', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
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

    const positionFetcherRegistry = moduleRef.get(PositionFetcherRegistry);
    const priceSelectorService = moduleRef.get(PriceSelectorService);
    positionFetcherRegistry.onApplicationBootstrap();
    await priceSelectorService.onApplicationBootstrap();
  }, 30 * 1000);

  afterAll(async () => {
    await moduleRef.close();
  });

  it.each(getAllAppTokenFetchers().slice(0, 3))(`builds tokens for (%s, %s, %s)`, async (appId, network, groupId) => {
    const positionFetcherRegistry = moduleRef.get(PositionFetcherRegistry);
    const fetcher = positionFetcherRegistry.get({ type: ContractType.APP_TOKEN, appId, groupId, network });
    expect(fetcher).toBeDefined();

    const result = await fetcher.getPositions();
    const pathToSnap = path.resolve(__dirname, `./__snapshots__/${appId}_${network}_${groupId}.app-tokens.shot`);
    expect(result).toMatchSpecificSnapshot(pathToSnap);
  });
});
