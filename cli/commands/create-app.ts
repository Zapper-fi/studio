import { Command } from '@oclif/core';
import { ensureDir } from 'fs-extra';

import { generateAppModule } from '../generators/generate-app-module';
import { promptAppId, promptAppName, promptAppNetworks } from '../prompts';
import { strings } from '../strings';

import { generateViemContractFactory } from './generate-contract-factory/generate-viem-contract-factory';

export default class CreateApp extends Command {
  static description = 'Creates the starting point for an app integration';
  static examples = [`$ ./studio create-app`];
  static flags = {};
  static args = [{ name: 'appId', description: 'The application id ', required: true }];

  async run(): Promise<void> {
    const appName = await promptAppName();
    const appId = await promptAppId(strings.kebabCase(appName));
    const networks = await promptAppNetworks();

    await ensureDir(`./src/apps/${appId}`);
    await ensureDir(`./src/apps/${appId}/assets`);
    await ensureDir(`./src/apps/${appId}/contracts`);
    await ensureDir(`./src/apps/${appId}/contracts/abis`);
    for (const network of networks) {
      await ensureDir(`./src/apps/${appId}/${network}`);
    }

    await generateAppModule(appId);
    await generateViemContractFactory(`./src/apps/${appId}`);

    this.log(`Done! Your app ${appName} has been generated`);
  }
}
