import dedent from 'dedent';
import fse from 'fs-extra';
import { zipObject } from 'lodash';

import { AppDefinitionObject, AppTag } from '../../src/app/app.interface';
import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

export function generateAppDefinition(appDefinition: Partial<AppDefinitionObject>) {
  const appDefinitionName = `${strings.upperCase(appDefinition.id)}_DEFINITION`;
  const appClassName = strings.titleCase(appDefinition.id);

  const networkToKey = zipObject(Object.values(Network), Object.keys(Network));
  const tagToKey = zipObject(Object.values(AppTag), Object.keys(AppTag));

  const content = dedent`
    import { Register } from '~app-toolkit/decorators';
    import { appDefinition, AppDefinition } from '~app/app.definition';
    import { AppAction, AppTag } from '~app/app.interface';
    import { Network } from '~types/network.interface';

    export const ${appDefinitionName} = appDefinition({
      id: '${appDefinition.id}',
      name: '${appDefinition.name}',
      description: '${appDefinition.description}',
      url: '${appDefinition.url}',
      groups: ${JSON.stringify(appDefinition.groups)},
      tags: [${appDefinition.tags.map(n => `AppTag.${tagToKey[n]}`).join(',')}],
      keywords: [],
      links: {
        learn: '',
        github: '',
        twitter: '',
        telegram: '',
        discord: '',
        medium: '',
      },
      supportedNetworks: {
        ${[].map(n => `[Network.${networkToKey[n]}]: [AppAction.VIEW]`).join(',\n')}
      },
      primaryColor: '#fff',
    });

    @Register.AppDefinition(${appDefinitionName}.id)
    export class ${appClassName}AppDefinition extends AppDefinition {
      constructor() {
        super(${appDefinitionName});
      }
    }

    export default ${appDefinitionName};
  `;

  fse.writeFileSync(`./src/apps/${appDefinition.id}/${appDefinition.id}.definition.ts`, `${content}\n`);
}
