import fs from 'fs';
import { promisify } from 'util';

import { PositionFetcherTemplateRegistry } from '~position/position-fetcher.template-registry';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { TestHarness } from './harness';

const access = promisify(fs.access);

describe('App Token Fetchers', () => {
  let testHarness: TestHarness;

  beforeAll(async () => {
    testHarness = new TestHarness();
    await testHarness.setup();
  }, 30 * 1000);

  afterAll(async () => {
    await testHarness.teardown();
  });

  it('should follow convention for filenames', async () => {
    const registry = testHarness.moduleRef.get(PositionFetcherTemplateRegistry);
    registry.onModuleInit();

    const templates = registry.getAllTemplates();
    const fileExists = await Promise.all(
      templates.map(async t => {
        const suffix = t instanceof AppTokenTemplatePositionFetcher ? `token-fetcher` : `contract-position-fetcher`;
        return access(`src/apps/${t.appId}/${t.network}/${t.appId}.${t.groupId}.${suffix}.ts`)
          .then(() => true)
          .catch(() => false);
      }),
    );

    const missingFiles = templates
      .filter((t, i) => !fileExists[i])
      .map(t => `(${t.constructor.name}: ${t.appId}, ${t.groupId}, ${t?.network})`);

    expect(missingFiles, `${missingFiles.join(', ')} have incorrect filename conventions`).toHaveLength(0);
  });
});
