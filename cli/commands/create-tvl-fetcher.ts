/* eslint no-console: 0 */

import { Command } from '@oclif/core';

import { addTvlFetcherToAppModule } from '../generators/generate-app-module';
import { generateTvlFetcher } from '../generators/generate-tvl-fetcher';
import { loadAppDefinition } from '../generators/utils';
import { promptAppNetwork } from '../prompts';

export default class CreateTvlFetcher extends Command {
  static description = 'Creates a TVL fetcher in a given app';
  static examples = [`$ ./studio create-tvl-fetcher appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(CreateTvlFetcher);
    const appId = args.appId;

    const definition = await loadAppDefinition(appId);
    const networks = Object.keys(definition.supportedNetworks);

    const network = await promptAppNetwork(networks);

    await generateTvlFetcher(appId, network);
    await addTvlFetcherToAppModule({ appId, network });
  }
}
