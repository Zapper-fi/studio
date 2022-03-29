import fs from 'fs';
import path from 'path';
import util from 'util';

import { Command } from '@oclif/core';
import chalk from 'chalk';
import { camelCase, kebabCase, sortBy, upperFirst } from 'lodash';
import { glob, runTypeChain } from 'typechain';

import { execCodeFormatting } from '../format/exec-code-formatting';
import { appPath } from '../paths/app-path';
import { strings } from '../strings';

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
            isRoot ? '' : 'super(networkProviderService);'
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

export default class NewCommand extends Command {
  static description =
    'Generate typescript contract factories for a given app based on the ABIs contained within the contracts/abis folder.';

  static examples = [`$ ./agora.sh generate:contract-factory my-app`];

  static flags = {};

  static args = [{ name: 'appid', description: 'The application id (just the folder name)', required: true }];

  async run(): Promise<void> {
    const { args } = await this.parse(NewCommand);
    const appId = args.appid;

    try {
      const location = appPath(appId);
      await generateContract(location);
      console.log(chalk.green(`Contract generated at ${location}`));

      await generateContractFactory(location);
      console.log(chalk.green(`Factory function generated at ${location}`));

      console.log(chalk.green(`Formatting newly generated files at ${location}`));
      execCodeFormatting(`${location}/contracts`);
    } catch (e) {
      const err = strings.lines([chalk.red('generate-contract-factory.ts - Failed'), e.message]);
      console.error(err);
    }
  }
}
