/* eslint no-console: 0 */

import { Command } from '@oclif/core';

import { addBalanceFetcherToAppModule } from '../generators/generate-app-module';
import { generateBalanceFetcher } from '../generators/generate-balance-fetcher';
import { promptAppNetwork } from '../prompts';

export default class CreateBalanceFetcher extends Command {
  static description = 'Creates a balance fetcher in a given app';
  static examples = [`$ ./studio create-balance-fetcher appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(CreateBalanceFetcher);
    const appId = args.appId;

    const network = await promptAppNetwork();

    await generateBalanceFetcher(appId, network);
    await addBalanceFetcherToAppModule({ appId, network });
  }
}
