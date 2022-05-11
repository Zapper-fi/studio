import dedent from 'dedent';
import fse from 'fs-extra';
import { compact, partition, sortBy } from 'lodash';
import * as recast from 'recast';

import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

import { formatAndWrite } from './utils';

import t = recast.types.namedTypes;

export async function generateAppModule(appId: string) {
  const appTitleCase = strings.titleCase(appId);
  const appUpperCase = strings.upperCase(appId);

  const content = dedent`
    import { Register } from '~app-toolkit/decorators';
    import { AbstractApp } from '~app/app.dynamic-module';
    
    import { ${appTitleCase}ContractFactory } from './contracts';
    import { ${appTitleCase}AppDefinition, ${appUpperCase}_DEFINITION } from './${appId}.definition';

    @Register.AppModule({
      appId: ${appUpperCase}_DEFINITION.id,
      providers: [
        ${appTitleCase}AppDefinition,
        ${appTitleCase}ContractFactory,
      ],
    })
    export class ${appTitleCase}AppModule extends AbstractApp() {}
  `;

  await formatAndWrite(`./src/apps/${appId}/${appId}.module.ts`, content);
}

const buildAddFetcherToAppModule =
  (filenameSuffix: string) =>
  async ({ appId, groupId, network }: { appId: string; groupId?: string; network: Network }) => {
    const classSuffix = strings.titleCase(filenameSuffix);
    const classPrefix = compact([network, appId, groupId])
      .map(v => strings.titleCase(v))
      .join('');
    const className = `${classPrefix}${classSuffix}`;

    const filenamePrefix = compact([appId, groupId]).join('.');
    const filename = `./${network}/${filenamePrefix}.${filenameSuffix}`;

    const contents = fse.readFileSync(`./src/apps/${appId}/${appId}.module.ts`, 'utf-8');
    const ast = recast.parse(contents, { parser: require('recast/parsers/typescript') });
    const b = recast.types.builders;

    recast.visit(ast, {
      visitProgram(path) {
        // Add an import statement for the fetcher
        const value = path.value as t.Program;
        const [imports, rest] = partition(value.body, v => v.type === 'ImportDeclaration');
        const newImport = b.importDeclaration([b.importSpecifier(b.identifier(className))], b.literal(filename));
        value.body = [...imports, newImport, ...rest];
        this.traverse(path);
      },
      visitClassDeclaration(path) {
        // Add the fetcher class to the providers
        const decorator = (path.value as any).decorators[0] as t.Decorator;

        recast.visit(decorator, {
          visitObjectProperty(path) {
            const value = path.value as t.ObjectProperty;

            if ((value.key as t.Identifier).name === 'providers') {
              const newElements = [...(value.value as t.ArrayExpression).elements, b.identifier(className)];
              (value.value as t.ArrayExpression).elements = sortBy(newElements, v => (v as t.Identifier).name);
            }

            this.traverse(path);
          },
        });

        this.traverse(path);
      },
    });

    const content = recast.print(ast).code;
    await formatAndWrite(`./src/apps/${appId}/${appId}.module.ts`, content);
  };

export const addTokenFetcherToAppModule = buildAddFetcherToAppModule('token-fetcher');
export const addContractPositionFetcherToAppModule = buildAddFetcherToAppModule('contract-position-fetcher');
export const addBalanceFetcherToAppModule = buildAddFetcherToAppModule('balance-fetcher');
export const addTvlFetcherToAppModule = buildAddFetcherToAppModule('tvl-fetcher');
