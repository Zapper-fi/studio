/* eslint no-console: 0 */

import { Command } from '@oclif/core';

import { addContractPositionFetcherToAppModule } from '../generators/generate-app-module';
import { generateContractPositionFetcher } from '../generators/generate-contract-position-fetcher';
import { resolveNetworks } from '../generators/utils';
import { promptAppGroupId, promptAppNetwork } from '../prompts';

export default class CreateContractPositionFetcher extends Command {
  static description = 'Creates a contract position fetcher in a given app';
  static examples = [`$ ./studio create-contract-position-fetcher appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(CreateContractPositionFetcher);

    const appId = args.appId;
    const networks = resolveNetworks(appId);
    const groupId = await promptAppGroupId();
    const network = await promptAppNetwork(networks);

    await generateContractPositionFetcher(appId, groupId, network);
    await addContractPositionFetcherToAppModule({ appId, groupId, network });
  }
}
