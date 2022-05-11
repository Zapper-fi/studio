import { CliUx, Command } from '@oclif/core';
import fse from 'fs-extra';
import * as inquirer from 'inquirer';
import { zipObject } from 'lodash';

import { AppAction, AppTag } from '../../src/app/app.interface';
import { Network } from '../../src/types/network.interface';
import { generateAppDefinition } from '../generators/generate-app-definition';
import { strings } from '../strings';

export default class CreateApp extends Command {
  static description = 'Creates the starting point for an app integration';
  static examples = [`$ ./studio create-app`];
  static flags = {};
  static args = [];

  private async promptNetworks() {
    let networks: Network[] = [];
    do {
      const prompt = await inquirer.prompt([
        {
          name: 'networks',
          message: 'Select (at least one) network supported by the app',
          type: 'checkbox',
          choices: Object.values(Network)
            .filter(v => v !== Network.BITCOIN_MAINNET)
            .map(name => ({ name })),
        },
      ]);
      if (prompt.networks) networks = prompt.networks;
    } while (!networks.length);

    return networks;
  }

  private async promptTags() {
    let tags: AppTag[] = [];
    do {
      const prompt = await inquirer.prompt([
        {
          name: 'tags',
          message: 'Select (at least one) tag representing your app',
          type: 'checkbox',
          choices: Object.values(AppTag).map(name => ({ name })),
        },
      ]);
      if (prompt.tags) tags = prompt.tags;
    } while (!tags.length);

    return tags;
  }

  async run(): Promise<void> {
    const appName = await CliUx.ux.prompt('What is the name of the app ', { required: true });
    const appId = await CliUx.ux.prompt('What is the ID of the app ', {
      required: true,
      default: strings.kebabCase(appName),
    });
    const appDescription = await CliUx.ux.prompt('What is the description of your app ', { required: true });
    const appUrl = await CliUx.ux.prompt('What is the URL of your app ', { required: true });

    const networks = await this.promptNetworks();
    const tags = await this.promptTags();

    fse.ensureDir(`./src/apps/${appId}`);
    fse.ensureDir(`./src/apps/${appId}/assets`);
    fse.ensureDir(`./src/apps/${appId}/contracts`);
    fse.ensureDir(`./src/apps/${appId}/contracts/abis`);
    for (const network of networks) {
      fse.ensureDir(`./src/apps/${appId}/${network}`);
    }

    generateAppDefinition({
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

    this.log(`You can now fill/update ${appId}.definition.ts`);
  }
}
