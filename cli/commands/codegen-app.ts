import { Command } from '@oclif/core';
import dedent from 'dedent';
import { ESLint } from 'eslint';
import fse from 'fs-extra';
import prettier from 'prettier';

import { AppGroup, GroupType } from '../../src/app/app.interface';
import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

export default class CodegenApp extends Command {
  static description = '';
  static examples = [`$ ./studio codegen-app appId`];
  static flags = {};
  static args = [{ name: 'appId', description: 'The application id ', required: true }];

  async run(): Promise<void> {
    const { args } = await this.parse(CodegenApp);

    const appId = args.appId;
    const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;

    const definitionModule = require(`../src/apps/${appId}/${appId}.definition`);
    const definition = definitionModule[appDefinitionName];
    const networksRaw = definition.supportedNetworks;

    const networks = Object.keys(networksRaw);
    const groups = definition.groups;
    let moduleImports = '';
    let moduleProviders = '';

    for (const network of networks) {
      moduleImports += generateImportStatementForModule(appId, 'balance', network);
      moduleProviders += generateClassNamesForModule(appId, 'balance', network);

      for (const [key, appGroup] of Object.entries<AppGroup>(groups)) {
        switch (appGroup.type) {
          case GroupType.TOKEN:
            generateTokenFetcher(appId, key, appGroup.id, network);
            moduleImports += generateImportStatementForModule(appId, appGroup.type, network, appGroup.id);
            moduleProviders += generateClassNamesForModule(appId, appGroup.type, network, appGroup.id);
            break;

          case GroupType.POSITION:
            generateContractPosition(appId, key, appGroup.id, network);
            moduleImports += generateImportStatementForModule(appId, appGroup.type, network, appGroup.id);
            moduleProviders += generateClassNamesForModule(appId, appGroup.type, network, appGroup.id);
            break;

          default:
            break;
        }
      }
      generateBalanceFetcher(appId, network);
    }
    await generateModule(appId, moduleImports, moduleProviders);
    this.log(`Files for ${appId} were generated !`);
  }
}

function generateClassNamesForModule(appId: string, appGroupType: string, networkRaw: string, appGroupId?: string) {
  const appTitleCase = strings.titleCase(appId);
  const typeTitleCase = strings.titleCase(appGroupType);
  const networkTitleCase = strings.titleCase(networkRaw);
  const appGroupIdTitleCase = strings.titleCase(appGroupId);

  return dedent`\n      ${networkTitleCase}${appTitleCase}${appGroupIdTitleCase}${typeTitleCase}Fetcher,`;
}

function generateImportStatementForModule(
  appId: string,
  appGroupType: string,
  networkRaw: string,
  appGroupId?: string,
) {
  const appTitleCase = strings.titleCase(appId);
  const networkTitleCase = strings.titleCase(networkRaw);
  const typeTitleCase = strings.titleCase(appGroupType);
  const appGroupIdTitleCase = strings.titleCase(appGroupId);

  const filename =
    appGroupType === 'balance' ? `${appId}.${appGroupType}-fetcher` : `${appId}.${appGroupId}.${appGroupType}-fetcher`;

  return dedent`import { ${networkTitleCase}${appTitleCase}${appGroupIdTitleCase}${typeTitleCase}Fetcher } from './${networkRaw}/${filename}';\n`;
}

async function generateModule(appId: string, importStatement: string, providers: string) {
  const appTitleCase = strings.titleCase(appId);

  const generatedContent = dedent`
  import { Module } from '@nestjs/common';

  import { AbstractDynamicApp } from '~app/app.dynamic-module';
  
  import { ${appTitleCase}ContractFactory } from './contracts';
  import { ${appTitleCase}AppDefinition } from './${appId}.definition';
${importStatement}
  @Module({
    providers: [
      ${appTitleCase}AppDefinition,
      ${appTitleCase}ContractFactory,${providers}
    ],
  })
  export class ${appTitleCase}AppModule extends AbstractDynamicApp<${appTitleCase}AppModule>() {}
  
  `;

  const eslint = new ESLint({ fix: true });
  const config = await prettier.resolveConfig(process.cwd());
  fse.writeFileSync(
    `./src/apps/${appId}/${appId}.module.ts`,
    prettier.format(generatedContent, { ...config, parser: 'typescript' }),
  );
  const results = await eslint.lintFiles(`./src/apps/${appId}/${appId}.module.ts`);
  await ESLint.outputFixes(results);
}

function generateBalanceFetcher(appId: string, networkRaw: string) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appTitleCase = strings.titleCase(appId);

  const network = Object.keys(Network as Record<string, unknown>).filter(k => networkRaw.includes(Network[k]));
  const networkTitleCase = strings.titleCase(networkRaw);

  const generatedContent = dedent`
  import { Inject } from '@nestjs/common';

  import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
  import { Register } from '~app-toolkit/decorators';
  import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
  import { BalanceFetcher } from '~balance/balance-fetcher.interface';
  import { Network } from '~types/network.interface';
  
  import { ${appDefinitionName} } from '../${appId}.definition';
  
  const network = Network.${network};
  
  @Register.BalanceFetcher(${appDefinitionName}.id, network)
  export class ${networkTitleCase}${appTitleCase}BalanceFetcher implements BalanceFetcher {
    constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}
  
    async getBalances(address: string) {
      return presentBalanceFetcherResponse([]);
    }
  }
  
  `;
  fse.writeFileSync(`./src/apps/${appId}/${networkRaw}/${appId}.balance-fetcher.ts`, `${generatedContent}\n`);
}

function generateTokenFetcher(appId: string, groupdId: string, groupdValue: string, networkRaw: string) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appTitleCase = strings.titleCase(appId);
  const appCamelCase = strings.camelCase(appTitleCase);

  const groupTitleCase = strings.titleCase(groupdValue);

  const network = Object.keys(Network as Record<string, unknown>).filter(k => networkRaw.includes(Network[k]));
  const networkTitleCase = strings.titleCase(networkRaw);

  const generatedContent = dedent`
  import { Inject } from '@nestjs/common';

  import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
  import { Register } from '~app-toolkit/decorators';
  import { PositionFetcher } from '~position/position-fetcher.interface';
  import { AppTokenPosition } from '~position/position.interface';
  import { Network } from '~types/network.interface';
  
  import { ${appTitleCase}ContractFactory } from '../contracts';
  import { ${appDefinitionName} } from '../${appId}.definition';
  
  const appId = ${appDefinitionName}.id;
  const groupId = ${appDefinitionName}.groups.${groupdId}.id;
  const network = Network.${network};
  
  @Register.TokenPositionFetcher({ appId, groupId, network })
  export class ${networkTitleCase}${appTitleCase}${groupTitleCase}TokenFetcher implements PositionFetcher<AppTokenPosition> {
    constructor(
      @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
      @Inject(${appTitleCase}ContractFactory) private readonly ${appCamelCase}ContractFactory: ${appTitleCase}ContractFactory,
    ) {}
  
    async getPositions() {
      return [];
    }
  }

`;
  fse.writeFileSync(
    `./src/apps/${appId}/${networkRaw}/${appId}.${groupdValue}.token-fetcher.ts`,
    `${generatedContent}\n`,
  );
}

function generateContractPosition(appId: string, groupId: string, groupdValue: string, networkRaw: string) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appTitleCase = strings.titleCase(appId);
  const appCamelCase = strings.camelCase(appTitleCase);

  const groupTitleCase = strings.titleCase(groupdValue);

  const network = Object.keys(Network as Record<string, unknown>).filter(k => networkRaw.includes(Network[k]));
  const networkTitleCase = strings.titleCase(networkRaw);

  const generatedContent = dedent`
  import { Inject } from '@nestjs/common';

  import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
  import { Register } from '~app-toolkit/decorators';
  import { PositionFetcher } from '~position/position-fetcher.interface';
  import { ContractPosition } from '~position/position.interface';
  import { Network } from '~types/network.interface';
  
  import { ${appTitleCase}ContractFactory } from '../contracts';
  import { ${appDefinitionName} } from '../${appId}.definition';
  
  const appId = ${appDefinitionName}.id;
  const groupId = ${appDefinitionName}.groups.${groupId}.id;
  const network = Network.${network};
  
  @Register.ContractPositionFetcher({ appId, groupId, network })
  export class ${networkTitleCase}${appTitleCase}${groupTitleCase}ContractPositionFetcher implements PositionFetcher<ContractPosition> {
    constructor(
      @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
      @Inject(${appTitleCase}ContractFactory) private readonly ${appCamelCase}ContractFactory: ${appTitleCase}ContractFactory,
    ) {}
  
    async getPositions() {
      return [];
    }
  }

`;
  fse.writeFileSync(
    `./src/apps/${appId}/${networkRaw}/${appId}.${groupdValue}.contract-position-fetcher.ts`,
    `${generatedContent}\n`,
  );
}
