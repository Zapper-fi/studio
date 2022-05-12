import { Command } from '@oclif/core';
import fse from 'fs-extra';
import { zipObject } from 'lodash';

import { AppAction } from '../../src/app/app.interface';
import { generateAppDefinition } from '../generators/generate-app-definition';
import { generateAppModule } from '../generators/generate-app-module';
import { promptAppDescription, promptAppName, promptAppNetworks, promptAppTags, promptAppUrl } from '../prompts';

import { generateContractFactory } from './generate-contract-factory';

export default class CreateApp extends Command {
  static description = 'Creates the starting point for an app integration';
  static examples = [`$ ./studio create-app`];
  static flags = {};
  static args = [{ name: 'appId', description: 'The application id ', required: true }];

  async run(): Promise<void> {
    const { args } = await this.parse(CreateApp);
    const appId = args.appId;

    const appName = await promptAppName();
    const appDescription = await promptAppDescription();
    const appUrl = await promptAppUrl();
    const networks = await promptAppNetworks();
    const tags = await promptAppTags();

    fse.ensureDir(`./src/apps/${appId}`);
    fse.ensureDir(`./src/apps/${appId}/assets`);
    fse.ensureDir(`./src/apps/${appId}/contracts`);
    fse.ensureDir(`./src/apps/${appId}/contracts/abis`);
    for (const network of networks) {
      fse.ensureDir(`./src/apps/${appId}/${network}`);
    }

    await generateAppModule(appId);
    await generateAppDefinition({
      id: appId,
      name: appName,
      description: appDescription,
      url: appUrl,
      tags,
      supportedNetworks: zipObject(
        networks,
        networks.map(() => [AppAction.VIEW]),
      ),
    });

    await generateContractFactory(`./src/apps/${appId}`);
    this.log(`You can now fill/update ${appId}.definition.ts`);
  }
}
