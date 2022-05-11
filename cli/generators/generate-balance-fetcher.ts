import dedent from 'dedent';

import { Network } from '../../src/types/network.interface';
import { strings } from '../strings';

import { formatAndWrite } from './utils';

export async function generateBalanceFetcher(appId: string, network: Network) {
  const appDefinitionName = `${strings.upperCase(appId)}_DEFINITION`;
  const appCamelCase = strings.camelCase(appId);
  const appTitleCase = strings.titleCase(appCamelCase);

  const networkKey = Object.keys(Network).find(k => network.includes(Network[k]));
  const networkTitleCase = strings.titleCase(network);

  const content = dedent`
    import { Inject } from '@nestjs/common';

    import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
    import { Register } from '~app-toolkit/decorators';
    import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
    import { BalanceFetcher } from '~balance/balance-fetcher.interface';
    import { Network } from '~types/network.interface';
    
    import { ${appDefinitionName} } from '../${appId}.definition';
    
    const network = Network.${networkKey};
    
    @Register.BalanceFetcher(${appDefinitionName}.id, network)
    export class ${networkTitleCase}${appTitleCase}BalanceFetcher implements BalanceFetcher {
      constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}
    
      async getBalances(address: string) {
        return presentBalanceFetcherResponse([]);
      }
    }
  `;

  await formatAndWrite(`./src/apps/${appId}/${network}/${appId}.balance-fetcher.ts`, content);
}
