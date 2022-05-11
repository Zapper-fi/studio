import dedent from 'dedent';

import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

import { formatAndWrite } from './utils';

export async function generateContractPositionFetcher(appId: string, groupId: string, network: Network) {
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
    import { ContractPosition } from '~position/position.interface';
    import { Network } from '~types/network.interface';
    
    import { ${appTitleCase}ContractFactory } from '../contracts';
    import { ${appDefinitionName} } from '../${appId}.definition';
    
    const appId = ${appDefinitionName}.id;
    const groupId = ${appDefinitionName}.groups.${groupKey}.id;
    const network = Network.${networkKey};
    
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

  await formatAndWrite(`./src/apps/${appId}/${network}/${appId}.${groupId}.contract-position-fetcher.ts`, content);
}
