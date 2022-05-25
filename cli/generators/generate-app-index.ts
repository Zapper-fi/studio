import dedent from 'dedent';
import * as recast from 'recast';

import { strings } from '../strings';

import { formatAndWrite } from './utils';

export async function generateAppIndex(appId: string) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appClassName = strings.titleCase(appId);

  const content = dedent`
    export { ${appDefinitionName}, ${appClassName}AppDefinition } from './${appId}.definition';
    export { ${appClassName}AppModule } from './${appId}.module';
    export { ${appClassName}ContractFactory } from './contracts';
  `;

  const ast = recast.parse(content, { parser: require('recast/parsers/typescript') });
  const prettyContent = recast.prettyPrint(ast).code;
  await formatAndWrite(`./src/apps/${appId}/index.ts`, prettyContent);
}
