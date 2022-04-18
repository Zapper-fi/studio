import { CliUx, Command } from '@oclif/core';
import dedent from 'dedent';
import fse from 'fs-extra';
import * as inquirer from 'inquirer';

import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

export default class CreateApp extends Command {
  static description = '';
  static examples = [`$ ./studio create-app`];
  static flags = {};
  static args = [];

  async run(): Promise<void> {
    const appName = await CliUx.ux.prompt('What is the name of the app ', { required: true });
    const appId = await CliUx.ux.prompt('What is the ID of the app ', {
      required: true,
      default: strings.kebabCase(appName),
    });
    const appDescription = await CliUx.ux.prompt('What is the description of your app ', { required: true });
    const appUrl = await CliUx.ux.prompt('What is the URL of your app ', { required: true });

    const response: any = await inquirer.prompt([
      {
        name: 'network',
        message: 'Select networks supported by the app',
        type: 'checkbox',
        choices: [
          { name: 'ethereum' },
          { name: 'polygon' },
          { name: 'optimism' },
          { name: 'gnosis' },
          { name: 'binance-smart-chain' },
          { name: 'fantom' },
          { name: 'avalanche' },
          { name: 'arbitrum' },
          { name: 'celo' },
          { name: 'harmony' },
          { name: 'moonriver' },
          { name: 'bitcoin' },
        ],
      },
    ]);

    const supportedNetworksRaw: string[] = response.network;
    createFolder(`./src/apps/${appId}`);
    createFolder(`./src/apps/${appId}/assets`);
    createFolder(`./src/apps/${appId}/contracts`);
    createFolder(`./src/apps/${appId}/contracts/abis`);

    for (const network of supportedNetworksRaw) {
      createFolder(`./src/apps/${appId}/${network}`);
    }

    const supportedNetworks = formatNetworks(supportedNetworksRaw);
    const generatedNetworks = generateSupportedNetworks(supportedNetworks);
    const generatedCode = generateDefinitionFile(appId, appName, appDescription, appUrl, generatedNetworks);
    fse.writeFileSync(`./src/apps/${appId}/${appId}.definition.ts`, `${generatedCode}\n`);
    this.log(`You can now fill/update ${appId}.definition.ts`);
  }
}

function generateSupportedNetworks(supportedNetworks: string[]): string {
  let formattedNetworks = '';
  for (const network of supportedNetworks) {
    formattedNetworks += `\n      [Network.${network}]: [ProtocolAction.VIEW],`;
  }

  return `${formattedNetworks}`;
}

function formatNetworks(userInputNetworks: string[]): string[] {
  const supportedNetworks = userInputNetworks.map(network => {
    const choices = strings.kebabCase(network).split(',');

    return Object.keys(Network as Record<string, unknown>).filter(k => choices.includes(Network[k]));
  });

  return supportedNetworks.flat();
}

function generateDefinitionFile(
  appId: string,
  appName: string,
  appDescription: string,
  appUrl: string,
  supportedNetworks: string,
) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appClassName = strings.titleCase(appName);

  return dedent`
  import { Register } from '~app-toolkit/decorators';
  import { AppDefinition } from '~app/app.definition';
  import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
  import { Network } from '~types/network.interface';

  export const ${appDefinitionName} = {
    id: '${appId}',
    name: '${appName}',
    description: '${appDescription}',
    url: '${appUrl}',
    groups: {
      camelCase: { id: 'kebab-case', type: GroupType.TOKEN },
      camelCase2: { id: 'kebab-case2', type: GroupType.POSITION },
    },
    tags: [],
    supportedNetworks: {${supportedNetworks}
    },
    primaryColor: '#fff',
  };

  @Register.AppDefinition(${appDefinitionName}.id)
  export class ${appClassName}AppDefinition extends AppDefinition {
    constructor() {
      super(${appDefinitionName});
    }
  }

  export default ${appDefinitionName};
`;
}

function createFolder(path: string) {
  fse.ensureDir(path);
}
