import dedent from 'dedent';
import fse from 'fs-extra';

import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

export function generateTokenFetcher(appId: string, groupId: string, network: string) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appCamelCase = strings.camelCase(appId);
  const appTitleCase = strings.titleCase(appCamelCase);
  const groupKey = strings.camelCase(groupId);
  const groupTitleCase = strings.titleCase(groupKey);

  const networkKey = Object.keys(Network).filter(k => network.includes(Network[k]));
  const networkTitleCase = strings.titleCase(network);

  const content = dedent`
    import { Inject } from '@nestjs/common';

    import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
    import { Register } from '~app-toolkit/decorators';
    import { PositionFetcher } from '~position/position-fetcher.interface';
    import { AppTokenPosition } from '~position/position.interface';
    import { Network } from '~types/network.interface';
    
    import { ${appTitleCase}ContractFactory } from '../contracts';
    import { ${appDefinitionName} } from '../${appId}.definition';
    
    const appId = ${appDefinitionName}.id;
    const groupId = ${appDefinitionName}.groups.${groupKey}.id;
    const network = Network.${networkKey};
    
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

  fse.mkdirpSync(`./src/apps/${appId}/${network}`);
  fse.writeFileSync(`./src/apps/${appId}/${network}/${appId}.${groupId}.token-fetcher.ts`, `${content}\n`);
}
