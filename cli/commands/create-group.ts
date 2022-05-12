/* eslint no-console: 0 */

import { Command } from '@oclif/core';

import { addGroupToAppDefinition } from '../generators/generate-app-definition';
import { loadAppDefinition } from '../generators/utils';
import { promptNewGroupId, promptNewGroupLabel, promptNewGroupType } from '../prompts';

export default class CreateGroup extends Command {
  static description = 'Creates a group in a given app';
  static examples = [`$ ./studio create-group appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(CreateGroup);
    const appId = args.appId;

    const definition = await loadAppDefinition(appId);
    const groupIds = Object.values(definition.groups).map(v => v.id);

    const id = await promptNewGroupId(groupIds);
    const label = await promptNewGroupLabel();
    const type = await promptNewGroupType();

    const group = { id, label, type };
    await addGroupToAppDefinition({ appId, group });
  }
}
