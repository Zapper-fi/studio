import { CliUx, Command } from '@oclif/core';
import dedent from 'dedent';
import fse from 'fs-extra';
import * as inquirer from 'inquirer';
import { zipObject } from 'lodash';
import prettier from 'prettier';

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

    const { networks } = await inquirer.prompt([
      {
        name: 'networks',
        message: 'Select networks supported by the app',
        type: 'checkbox',
        choices: Object.values(Network)
          .filter(v => v !== Network.BITCOIN_MAINNET)
          .map(name => ({ name })),
      },
    ]);

    createFolder(`./src/apps/${appId}`);
    createFolder(`./src/apps/${appId}/assets`);
    createFolder(`./src/apps/${appId}/contracts`);
    createFolder(`./src/apps/${appId}/contracts/abis`);
    for (const network of networks) {
      createFolder(`./src/apps/${appId}/${network}`);
    }

    const generatedCode = generateDefinitionFile(appId, appName, appDescription, appUrl, networks);
    const config = await prettier.resolveConfig(process.cwd());
    fse.writeFileSync(
      `./src/apps/${appId}/${appId}.definition.ts`,
      prettier.format(generatedCode, { ...config, parser: 'typescript' }),
    );
    this.log(`You can now fill/update ${appId}.definition.ts`);
  }
}

function generateDefinitionFile(
  appId: string,
  appName: string,
  appDescription: string,
  appUrl: string,
  networks: string[],
) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appClassName = strings.titleCase(appId);
  const networkToKey = zipObject(Object.values(Network), Object.keys(Network));

  return dedent`
  import { Register } from '~app-toolkit/decorators';
  import { AppDefinition } from '~app/app.definition';
  import { ProtocolAction } from '~app/app.interface';
  import { Network } from '~types/network.interface';

  export const ${appDefinitionName} = {
    id: '${appId}',
    name: '${appName}',
    description: '${appDescription}',
    url: '${appUrl}',
    groups: {},
    tags: [],
    links: {
      learn: '',
      github: '',
      twitter: '',
      telegram: '',
      discord: '',
      medium: '',
    };
    supportedNetworks: {
      ${networks.map(n => `[Network.${networkToKey[n]}]: [ProtocolAction.VIEW]`).join(',\n')}
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
