/* eslint no-console: 0 */

import { Command } from '@oclif/core';
import { camelCase } from 'lodash';

import { AppDefinitionObject, GroupType } from '../../src/app/app.interface';
import { generateAppDefinition } from '../generators/generate-app-definition';
import { addContractPositionFetcherToAppModule } from '../generators/generate-app-module';
import { generateContractPositionFetcher } from '../generators/generate-contract-position-fetcher';
import { promptAppGroupId, promptAppNetwork, promptNewGroupId, promptNewGroupLabel } from '../prompts';

export default class CreateContractPositionFetcher extends Command {
  static description = 'Creates a contract position fetcher in a given app';
  static examples = [`$ ./studio create-contract-position-fetcher appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  private async loadDefinition(appId: string) {
    const modPath = `../src/apps/${appId}/${appId}.definition`;
    const mod = require(modPath);
    const key = Object.keys(mod).find(v => /_DEFINITION/.test(v));
    if (!key) throw new Error(`No matched export found in ${modPath}`);
    return mod[key];
  }

  async run(): Promise<void> {
    const { args } = await this.parse(CreateContractPositionFetcher);
    const appId = args.appId;

    const definition: AppDefinitionObject = await this.loadDefinition(appId);
    const groupIds = Object.values(definition.groups).map(v => v.id);

    let groupId = await promptAppGroupId(groupIds);

    if (!groupId) {
      const newGroupId = await promptNewGroupId();
      const newGroupLabel = await promptNewGroupLabel();
      const newGroup = { id: newGroupId, label: newGroupLabel, type: GroupType.POSITION };

      definition.groups = { ...definition.groups, [camelCase(newGroupId)]: newGroup };
      groupId = newGroupId;
    }

    const network = await promptAppNetwork();

    await generateAppDefinition(definition);
    await generateContractPositionFetcher(appId, groupId, network);
    await addContractPositionFetcherToAppModule({ appId, groupId, network });
  }
}
