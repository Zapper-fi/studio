/* eslint no-console: 0 */

import { Command } from '@oclif/core';
import { camelCase } from 'lodash';

import { GroupType } from '../../src/app/app.interface';
import { generateAppDefinition } from '../generators/generate-app-definition';
import { addTokenFetcherToAppModule } from '../generators/generate-app-module';
import { generateTokenFetcher } from '../generators/generate-token-fetcher';
import { loadAppDefinition } from '../generators/utils';
import { promptAppGroupId, promptAppNetwork, promptNewGroupId, promptNewGroupLabel } from '../prompts';

export default class CreateTokenFetcher extends Command {
  static description = 'Creates a token fetcher in a given app';
  static examples = [`$ ./studio create-token-fetcher appId`];
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
    const { args } = await this.parse(CreateTokenFetcher);
    const appId = args.appId;

    const definition = await loadAppDefinition(appId);
    const groupIds = Object.values(definition.groups).map(v => v.id);
    const networks = Object.keys(definition.supportedNetworks);

    let groupId = await promptAppGroupId(groupIds);

    if (!groupId) {
      const newGroupId = await promptNewGroupId();
      const newGroupLabel = await promptNewGroupLabel();
      const newGroup = { id: newGroupId, label: newGroupLabel, type: GroupType.POSITION };

      definition.groups = { ...definition.groups, [camelCase(newGroupId)]: newGroup };
      groupId = newGroupId;
    }

    const network = await promptAppNetwork(networks);

    await generateAppDefinition(definition);
    await generateTokenFetcher(appId, groupId, network);
    await addTokenFetcherToAppModule({ appId, groupId, network });
  }
}
