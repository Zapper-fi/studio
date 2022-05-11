/* eslint no-console: 0 */

import { Command } from '@oclif/core';
import inquirer from 'inquirer';

import { Network } from '../../src/types/network.interface';
import { addBalanceFetcherToAppModule } from '../generators/generate-app-module';
import { generateTvlFetcher } from '../generators/generate-tvl-fetcher';

export default class CreateTvlFetcher extends Command {
  static description = 'Creates a TVL fetcher in a given app';
  static examples = [`$ ./studio create-tvl-fetcher appId`];
  static args = [{ name: 'appId', description: 'The application id ', required: true }];
  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(CreateTvlFetcher);
    const appId = args.appId;

    const { network } = await inquirer.prompt<{ network: Network }>({
      name: 'network',
      message: 'Select a network',
      type: 'list',
      choices: Object.values(Network)
        .filter(v => v !== Network.BITCOIN_MAINNET)
        .map(name => ({ name })),
    });

    await generateTvlFetcher(appId, network);
    await addBalanceFetcherToAppModule({ appId, network });
  }
}
