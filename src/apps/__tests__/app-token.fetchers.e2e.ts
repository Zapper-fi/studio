import path from 'path';

import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { TestHarness } from './harness';

require('jest-specific-snapshot');

const testHarness = new TestHarness();

describe.only('App Token Fetchers', () => {
  beforeAll(async () => {
    await testHarness.setup();
  }, 30 * 1000);

  afterAll(async () => {
    await testHarness.teardown();
  });

  describe.each(testHarness.getAppTokenFetchersUnderTest())(
    `(%s, %s, %s) positions`,
    (appId: string, network: Network, groupId: string) => {
      let results: AppTokenPosition[];

      beforeAll(async () => {
        results = await testHarness.getAppTokens({ appId, network, groupId });
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
    },
  );
});
