/* eslint no-console: 0 */
import { writeFileSync } from 'fs';
import path from 'path';

import { readFile } from 'fs-extra';
import { camelCase, sortBy, upperFirst } from 'lodash';

import { getAbis } from './get-abis';

export const generateViemContractFactory = async (location: string) => {
  const abis = await getAbis(location);
  const maybeAppId = path.basename(location);

  const sortedAbis = sortBy(abis);
  const globalAppId = 'contract';
  const globalClassName = 'ContractViemContractFactory';
  const appClassName = `${upperFirst(camelCase(maybeAppId))}ViemContractFactory`;
  const className = maybeAppId === globalAppId ? globalClassName : appClassName;

  const moduleFile = await readFile(path.resolve(location, `${maybeAppId}.module.ts`), 'utf-8').catch(() => '');
  const hasAppToolkitDep = moduleFile.includes(`extends AbstractApp()`);

  const renderer = {
    viem: async () => {
      writeFileSync(
        path.join(location, `/contracts/viem.contract-factory.ts`),
        `
        import { Injectable, Inject } from '@nestjs/common';
        import { PublicClient } from 'viem';

        import { Network } from '~types/network.interface';
        ${hasAppToolkitDep ? `import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';` : ''}
        ${!hasAppToolkitDep ? `import { Web3Service } from '~web3/web3.service';` : ''}
        
        ${
          sortedAbis.length
            ? `import { ${sortedAbis.map(abi => `${upperFirst(camelCase(abi))}__factory`).join(', ')} } from './viem';`
            : ''
        }
        
        ${sortedAbis.length ? `type ContractOpts = {address: string, network: Network};` : ''}
        ${!hasAppToolkitDep ? `type ViemNetworkProviderResolver = (network: Network) => PublicClient;` : ''}

        @Injectable()
        export class ${className} {
          ${
            hasAppToolkitDep
              ? `constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}`
              : `constructor(protected readonly networkProviderResolver: ViemNetworkProviderResolver) {}`
          }

          ${sortedAbis
            .map(
              abiName =>
                `${camelCase(abiName)}({address, network}: ContractOpts) { return ${upperFirst(
                  camelCase(abiName),
                )}__factory.connect(address, ${
                  hasAppToolkitDep
                    ? `this.appToolkit.getViemNetworkProvider(network)`
                    : `this.networkProviderResolver(network)`
                }); }`,
            )
            .join('\n')}
        }
      `,
      );
    },
  };

  await renderer.viem();
};
