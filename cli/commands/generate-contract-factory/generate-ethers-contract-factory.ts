/* eslint no-console: 0 */
import path from 'path';

import { camelCase, sortBy, upperFirst } from 'lodash';

import { formatAndWrite } from '../../generators/utils';

import { getAbis } from './get-abis';

export const generateEthersContractFactory = async (location: string) => {
  const abis = sortBy(await getAbis(location));
  const factoryName = upperFirst(camelCase(path.basename(location)));
  const isRoot = path.basename(location) === 'contract';
  const factoryFullName = isRoot ? 'ContractFactory' : `${factoryName}ContractFactory`;

  const renderer = {
    ethers: async () => {
      const imports = abis.flatMap(abi => {
        const typeName = upperFirst(camelCase(abi));
        return [`import { ${typeName}__factory } from './ethers';`, `import type { ${typeName} } from './ethers';`];
      });

      const factoryMethods = abis.map(abi => {
        const methodName = camelCase(abi);
        const typeName = upperFirst(methodName);
        return `${methodName}({address, network}: ContractOpts) { return ${typeName}__factory.connect(address, ${
          isRoot ? 'this.networkProviderResolver(network)' : 'this.appToolkit.getNetworkProvider(network)'
        }); }`;
      });

      const interfaceRows = abis.map(abi => {
        const methodName = camelCase(abi);
        const typeName = upperFirst(methodName);
        return `${methodName}(opts: ContractOpts): ${typeName};`;
      });

      const reexports = abis.map(abi => {
        const typeName = upperFirst(camelCase(abi));
        return [`export type { ${typeName} } from './ethers'`];
      });

      await formatAndWrite(
        path.join(location, `/contracts/ethers.contract-factory.ts`),
        `
        import { Injectable, Inject } from '@nestjs/common';
        import { StaticJsonRpcProvider } from '@ethersproject/providers';
        import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

        import { NetworkProviderService } from '~network-provider/network-provider.service';
        import { Network } from '~types/network.interface';

        ${imports.join('\n')}
        ${isRoot ? '' : "import { ContractFactory } from '~contract/contracts'"}
        // eslint-disable-next-line
        type ContractOpts = {address: string, network: Network};
        ${!isRoot ? '' : 'type NetworkProviderResolver = (network: Network) => StaticJsonRpcProvider;'}

${
  isRoot
    ? `
        export interface IContractFactory {
          ${interfaceRows.join('\n')}
        }
        `
    : ''
}

        @Injectable()
        export class ${factoryFullName} ${isRoot ? 'implements IContractFactory' : 'extends ContractFactory'} {
constructor(${
          isRoot
            ? 'protected readonly networkProviderResolver: NetworkProviderResolver'
            : '@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit'
        }) { ${isRoot ? '' : 'super((network: Network) => appToolkit.getNetworkProvider(network));'} }

          ${factoryMethods.join('\n')}
        }

        ${reexports.join('\n')}
      `,
      );
    },
  };

  await renderer.ethers();
};
