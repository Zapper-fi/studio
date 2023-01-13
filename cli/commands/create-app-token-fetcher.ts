/* eslint no-console: 0 */

import { Command } from '@oclif/core';

import { AppGroup, GroupType } from '../../src/app/app.interface';
import { addTokenFetcherToAppModule } from '../generators/generate-app-module';
import { generateTokenFetcher } from '../generators/generate-token-fetcher';
import { resolveNetworks } from '../generators/utils';
import { promptAppGroupId, promptAppNetwork, promptNewGroupId, promptNewGroupLabel } from '../prompts';

export default class CreateAppTokenFetcher extends Command {
  static description = 'Creates a token fetcher in a given app';
  static examples = [`$ ./studio create-token-fetcher appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(CreateAppTokenFetcher);

    const appId = args.appId;
    const networks = resolveNetworks(appId);
    const groupId = await promptAppGroupId();
    const network = await promptAppNetwork(networks);

    await generateTokenFetcher(appId, groupId, network);
    await addTokenFetcherToAppModule({ appId, groupId, network });
  }
}
