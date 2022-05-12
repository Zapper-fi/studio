import dedent from 'dedent';
import fse from 'fs-extra';
import { camelCase, entries, zipObject } from 'lodash';
import * as recast from 'recast';

import { AppAction, AppDefinitionObject, AppGroup, AppTag, GroupType } from '../../src/app/app.interface';
import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

import { formatAndWrite } from './utils';

import t = recast.types.namedTypes;

export async function generateAppDefinition(appDefinition: Partial<AppDefinitionObject>) {
  const appDefinitionName = `${strings.upperCase(appDefinition.id)}_DEFINITION`;
  const appClassName = strings.titleCase(appDefinition.id);

  const networkToKey = zipObject(Object.values(Network), Object.keys(Network));
  const tagToKey = zipObject(Object.values(AppTag), Object.keys(AppTag));
  const actionToKey = zipObject(Object.values(AppAction), Object.keys(AppAction));
  const gtToKey = zipObject(Object.values(GroupType), Object.keys(GroupType));

  const content = dedent`
    import { Register } from '~app-toolkit/decorators';
    import { appDefinition, AppDefinition } from '~app/app.definition';
    import { GroupType, AppAction, AppTag } from '~app/app.interface';
    import { Network } from '~types/network.interface';

    export const ${appDefinitionName} = appDefinition({
      id: '${appDefinition.id}',
      name: '${appDefinition.name}',
      description: '${appDefinition.description}',
      url: '${appDefinition.url}',
      groups: {${entries(appDefinition.groups)
        .map(([gk, g]) => `${gk}: { id: '${g.id}', type: GroupType.${gtToKey[g.type]}, label: '${g.label}' }`)
        .join(',')}},
      tags: [${appDefinition.tags.map(n => `AppTag.${tagToKey[n]}`).join(',')}],
      keywords: ${JSON.stringify(appDefinition.keywords ?? [])},
      links: ${JSON.stringify(appDefinition.links ?? {})},
      supportedNetworks: {
        ${entries(appDefinition.supportedNetworks)
          .map(([nk, n]) => `[Network.${networkToKey[nk]}]: [${n.map(v => `AppAction.${actionToKey[v]}`).join(',')}]`)
          .join(',')}
      },
      primaryColor: '${appDefinition.primaryColor ?? '#fff'}',
    });

    @Register.AppDefinition(${appDefinitionName}.id)
    export class ${appClassName}AppDefinition extends AppDefinition {
      constructor() {
        super(${appDefinitionName});
      }
    }

    export default ${appDefinitionName};
  `;

  const ast = recast.parse(content, { parser: require('recast/parsers/typescript') });
  const prettyContent = recast.prettyPrint(ast).code;
  await formatAndWrite(`./src/apps/${appDefinition.id}/${appDefinition.id}.definition.ts`, prettyContent);
}

export const addGroupToAppModule = async ({ appId, group }: { appId: string; group: AppGroup }) => {
  const contents = fse.readFileSync(`./src/apps/${appId}/${appId}.definition.ts`, 'utf-8');
  const ast = recast.parse(contents, { parser: require('recast/parsers/typescript') });
  const b = recast.types.builders;
  const gtToKey = zipObject(Object.values(GroupType), Object.keys(GroupType));

  recast.visit(ast, {
    visitCallExpression(path) {
      const value = path.value as t.CallExpression;

      if ((value.callee as t.Identifier).name === 'appDefinition') {
        const appDefinitionObject = value.arguments[0] as t.ObjectExpression;
        const groups = (appDefinitionObject.properties as t.ObjectProperty[]).find(
          p => (p?.key as t.Identifier)?.name === 'groups',
        );

        const newGroupProperty = b.objectProperty(
          b.identifier(camelCase(group.id)),
          b.objectExpression([
            b.objectProperty(b.identifier('id'), b.stringLiteral(group.id)),
            b.objectProperty(
              b.identifier('type'),
              b.memberExpression(b.identifier('GroupType'), b.identifier(gtToKey[group.type])),
            ),
            b.objectProperty(b.identifier('label'), b.stringLiteral(group.label)),
          ]),
        );

        (groups.value as t.ObjectExpression).properties.push(newGroupProperty);
      }

      this.traverse(path);
    },
  });

  const content = recast.prettyPrint(ast).code;
  await formatAndWrite(`./src/apps/${appId}/${appId}.definition.ts`, content);
};
