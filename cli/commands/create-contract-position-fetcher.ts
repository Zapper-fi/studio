/* eslint no-console: 0 */

import { Command } from '@oclif/core';
import inquirer from 'inquirer';
import { camelCase } from 'lodash';

import { AppDefinitionObject, GroupType } from '../../src/app/app.interface';
import { Network } from '../../src/types/network.interface';
import { generateAppDefinition } from '../generators/generate-app-definition';
import { addContractPositionFetcherToAppModule } from '../generators/generate-app-module';
import { generateContractPositionFetcher } from '../generators/generate-contract-position-fetcher';

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

    let { groupId } = await inquirer.prompt<{ groupId: string | null }>({
      name: 'groupId',
      message: 'Select an existing group or create new:',
      type: 'list',
      choices: [...groupIds.map(name => ({ name })), { name: 'Create New', value: null }],
    });

    if (!groupId) {
      ({ groupId } = await inquirer.prompt<{ groupId: string }>({
        name: 'groupId',
        message: 'What is the ID of the group?',
        type: 'input',
        validate: v => {
          if (/[a-z0-9]+(?:-[a-z0-9]+)*/.test(v)) return true;
          return 'ID must be kebab-case';
        },
      }));

      const { groupLabel } = await inquirer.prompt<{ groupLabel: string }>({
        name: 'groupLabel',
        message: 'What is the friendly name of the group?',
        type: 'input',
      });

      definition.groups = {
        ...definition.groups,
        [camelCase(groupId)]: { id: groupId, label: groupLabel, type: GroupType.POSITION },
      };
    }

    const { network } = await inquirer.prompt<{ network: Network }>({
      name: 'network',
      message: 'Select a network',
      type: 'list',
      choices: Object.values(Network)
        .filter(v => v !== Network.BITCOIN_MAINNET)
        .map(name => ({ name })),
    });

    await generateAppDefinition(definition);
    await generateContractPositionFetcher(appId, groupId, network);
    await addContractPositionFetcherToAppModule({ appId, groupId, network });
  }
}
