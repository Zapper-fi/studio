/* eslint no-console: 0 */

import { Command } from '@oclif/core';

import { AppGroup, GroupType } from '../../src/app/app.interface';
import { addGroupToAppDefinition } from '../generators/generate-app-definition';
import { addContractPositionFetcherToAppModule } from '../generators/generate-app-module';
import { generateContractPositionFetcher } from '../generators/generate-contract-position-fetcher';
import { loadAppDefinition } from '../generators/utils';
import { promptAppGroupId, promptAppNetwork, promptNewGroupId, promptNewGroupLabel } from '../prompts';

export default class CreateContractPositionFetcher extends Command {
  static description = 'Creates a contract position fetcher in a given app';
  static examples = [`$ ./studio create-contract-position-fetcher appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(CreateContractPositionFetcher);
    const appId = args.appId;

    const definition = await loadAppDefinition(appId);
    const groupIds = Object.values(definition.groups).map(v => v.id);
    const networks = Object.keys(definition.supportedNetworks);

    let groupId = await promptAppGroupId(groupIds);
    let group: AppGroup | null = null;
    if (!groupId) {
      const newGroupId = await promptNewGroupId(groupIds);
      const newGroupLabel = await promptNewGroupLabel();
      group = { id: newGroupId, label: newGroupLabel, type: GroupType.POSITION };
      groupId = newGroupId;
    }

    const network = await promptAppNetwork(networks);

    await generateContractPositionFetcher(appId, groupId, network);
    await addContractPositionFetcherToAppModule({ appId, groupId, network });
    if (group) await addGroupToAppDefinition({ appId, group });
  }
}
