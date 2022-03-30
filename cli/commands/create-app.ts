import { CliUx, Command } from '@oclif/core';
import dedent from 'dedent';
import fse from 'fs-extra';
import * as inquirer from 'inquirer';

import { strings } from '../strings';

enum Network {
  ETHEREUM_MAINNET = 'ethereum',
  POLYGON_MAINNET = 'polygon',
  OPTIMISM_MAINNET = 'optimism',
  GNOSIS_MAINNET = 'gnosis',
  BINANCE_SMART_CHAIN_MAINNET = 'binance-smart-chain',
  FANTOM_OPERA_MAINNET = 'fantom',
  AVALANCHE_MAINNET = 'avalanche',
  ARBITRUM_MAINNET = 'arbitrum',
  CELO_MAINNET = 'celo',
  HARMONY_MAINNET = 'harmony',
  MOONRIVER_MAINNET = 'moonriver',
  BITCOIN_MAINNET = 'bitcoin',
}

export default class CreateApp extends Command {
  static description = '';
  static examples = [`$ ./agora create-app`];
  static flags = {};
  static args = [];

  async run(): Promise<void> {
    const appNameRaw = await CliUx.ux.prompt('What is the name of the app ', { required: true });
    const appName = strings.kebabCase(appNameRaw);
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
    createFolder(`./src/apps/${appName}`);
    createFolder(`./src/apps/${appName}/assets`);

    supportedNetworksRaw.forEach(network => {
      createFolder(`./src/apps/${appName}/${network}`);
    });

    const supportedNetworks = formatNetworks(supportedNetworksRaw);
    const generatedNetworks = generateSupportedNetworks(supportedNetworks);
    const generatedCode = generateDefinitionFile(appName, generatedNetworks);
    fse.writeFileSync(`./src/apps/${appName}/${appName}.definition.ts`, `${generatedCode}\n`);

    AddAppDefinitionToRegistry(appName);

    this.log(`You can now fill/update ${appName}.definition.ts`);
  }
}

function AddAppDefinitionToRegistry(appName: string) {
  const appDefinitionName = `${strings.upperCase(appName)}_DEFINITION`;

  fse.appendFileSync(
    './cli/imports/apps-definition-registry.ts',
    dedent`export { default as ${appDefinitionName} } from '../../src/apps/${appName}/${appName}.definition';\n
    `,
  );
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

function generateDefinitionFile(appName: string, supportedNetworks: string) {
  const appId = strings.kebabCase(appName);
  const appDefinitionName = `${strings.upperCase(appName)}_DEFINITION`;
  const appClassName = strings.titleCase(appName);

  return dedent`
  import { Register } from '~app-toolkit/decorators';
  import { AppDefinition } from '~app/app.definition';
  import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
  import { Network } from '~types/network.interface';

  export const ${appDefinitionName} = {
    id: '${appName}',
    name: '${appId}',
    description: '',
    groups: {
      camelCase: { id: 'kebab-case', type: GroupType.TOKEN },
      camelCase2: { id: 'kebab-case2', type: GroupType.POSITION },
    },
    url: '',
    tags: [ProtocolTag.LENDING],
    supportedNetworks: {${supportedNetworks}
    },
    primaryColor: '#fff',
    token: null,
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
