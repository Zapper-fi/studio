/* eslint no-console: 0 */
import path from 'path';

import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';

import { execCodeFormatting } from '../../format/exec-code-formatting';
import { appPath } from '../../paths/app-path';
import { strings } from '../../strings';

import { generateIndex } from './generate-index';
import { generateViemContract } from './generate-viem-contract';
import { generateViemContractFactory } from './generate-viem-contract-factory';
import { normalizeAbis } from './normalize-abis';

export default class GenerateContractFactory extends Command {
  static description =
    'Generate typescript contract factories for a given app based on the ABIs contained within the contracts/abis folder.';

  static examples = [`$ ./studio.sh generate:contract-factory my-app`, `$ ./studio.sh generate:contract-factory -g`];

  static flags = {
    global: Flags.boolean({ char: 'g' }),
  };

  static args = [{ name: 'appid', description: 'The application id (just the folder name)', required: false }];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(GenerateContractFactory);
    const appId = args.appid;

    if (!flags.global && !appId) {
      console.log(chalk.red(`An app ID or --global needs to be provided`));
      return;
    }

    const location = !flags.global ? appPath(appId) : path.resolve(__dirname, '../src/contract');

    try {
      await normalizeAbis(location);
      console.log(chalk.green(`Contracts abis have been normalized at ${location}`));

      await generateViemContract(location);
      console.log(chalk.green(`Viem contract generated at ${location}`));

      await generateViemContractFactory(location);
      console.log(chalk.green(`Viem factory class generated at ${location}`));

      await generateIndex(location);
      console.log(chalk.green(`Index file generated at ${location}`));

      console.log(chalk.green(`Formatting newly generated files at ${location}`));
      execCodeFormatting(`${location}/contracts`);
    } catch (e) {
      const err = strings.lines([chalk.red(`generate-contract-factory.ts - Failed: ${e.message}`), e.stack]);
      console.error(err);
    }
  }
}
