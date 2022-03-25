import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

import { camelCase, kebabCase, sortBy, upperFirst } from 'lodash';
import { glob, runTypeChain } from 'typechain';

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rm);
const readdir = util.promisify(fs.readdir);
const exists = util.promisify(fs.exists);

const getAbis = async (location: string) => {
  const abisDir = path.join(location, '/contracts/abis');
  await mkdir(abisDir, { recursive: true });

  const abis = (await readdir(abisDir, { withFileTypes: true }))
    .filter(f => f.isFile())
    .filter(f => path.extname(f.name) === '.json')
    .map(f => path.basename(f.name, '.json'))
    .filter(f => kebabCase(f) === f);

  return abis;
};

const generateContract = async (location: string) => {
  const abis = await getAbis(location);
  if (abis.length === 0) {
    throw new Error('no ABI to generate');
  }

  const providerDir = path.join(location, `/contracts/ethers`);
  const providerDirExists = await exists(providerDir);
  if (providerDirExists) {
    await rmdir(providerDir, { recursive: true });
    await mkdir(providerDir, { recursive: true });
  }

  const cwd = process.cwd();
  const allFiles = glob(cwd, [path.join(location, '/contracts/abis/*.json')]);

  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: providerDir,
    target: 'ethers-v5',
  });
};

const generateContractFactory = async (location: string) => {
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
        return `${methodName}({address, network}: ContractOpts) { return ${typeName}__factory.connect(address, this.networkProviderService.getProvider(network)); }`;
      });

      const reexports = abis.map(abi => {
        const typeName = upperFirst(camelCase(abi));
        return [`export type { ${typeName} } from './ethers'`];
      });

      await writeFile(
        path.join(location, `/contracts/index.ts`),
        `
        import { Injectable, Inject } from '@nestjs/common';

        import { NetworkProviderService } from '~network-provider/network-provider.service';
        import { Network } from '~types/network.interface';

        ${imports.join('\n')}
        ${isRoot ? '' : "import { ContractFactory } from '~contract/contracts'"}
        type ContractOpts = {address: string, network: Network};

        @Injectable()
        export class ${factoryFullName} ${isRoot ? '' : 'extends ContractFactory'} {
          constructor(@Inject(NetworkProviderService) protected readonly networkProviderService:  NetworkProviderService) { ${
            isRoot ? '' : 'super(web3Service);'
          } }

          ${factoryMethods.join('\n')}
        }

        ${reexports.join('\n')}
      `,
      );
    },
  };

  await renderer.ethers();
};

const run = async () => {
  if (!process.argv[2]) {
    throw new Error('LOCATION is required. Please specify the location where to generate the contract interfaces.');
  }

  const location = path.resolve(process.argv[2]);

  await generateContract(location);
  await generateContractFactory(location);

  execSync(`eslint --fix ${location}/contracts`, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  execSync(`prettier --write ${location}/contracts`, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
};

run().catch(err => {
  // eslint-disable-next-line no-console
  console.log('generate-contract-factory.ts - Failed: ', err);
});
