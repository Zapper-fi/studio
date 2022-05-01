/* eslint no-console: 0 */

import * as fs from 'fs';

import { Command } from '@oclif/core';
import * as inquirer from 'inquirer';
import { compact } from 'lodash';

import { NetworkProviderService } from '../../src/network-provider/network-provider.service';
import { Network } from '../../src/types/network.interface';

export default class SetNetworkProvider extends Command {
  static description = `Sets a network provider for a given network`;
  static examples = [`$ ./studio.sh json-rpc`];

  private envFileName = '.env';

  private async promptNetwork() {
    const { network } = await inquirer.prompt([
      {
        name: 'network',
        message: 'Select the network',
        type: 'list',
        choices: Object.values(Network)
          .filter(v => v !== Network.BITCOIN_MAINNET)
          .map(name => ({ name })),
      },
    ]);

    return network as Network;
  }

  private async promptAction() {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        message: 'Select the action',
        type: 'list',
        choices: [
          { name: 'Reset to default', value: 'default' },
          { name: 'Use your own network provider URL', value: 'custom' },
        ],
      },
    ]);

    return action as 'custom' | 'default';
  }

  private async promptNetworkProviderUrl() {
    const { url } = await inquirer.prompt([
      {
        name: 'url',
        message: 'Enter a valid network provider URL',
        type: 'input',
      },
    ]);

    return url as string;
  }

  async upsertFile(fileName: string) {
    try {
      fs.readFileSync(fileName);
    } catch (error) {
      fs.writeFileSync(fileName, '');
    }
  }

  private deleteLineEnv(network: Network) {
    const envVarKey = NetworkProviderService.getEnvVarKey(network);

    // Create .env file if not exist
    this.upsertFile(this.envFileName);

    // Delete the line related to the specified network if exists
    const envFileLines = fs.readFileSync(this.envFileName).toString().trim().split('\n');
    const envFileLine = envFileLines.findIndex(line => line.startsWith(`${envVarKey}=`));
    if (envFileLine >= 0) envFileLines[envFileLine] = null;

    // Rewrite file without the line
    const newEnvFile = compact(envFileLines).join('\n');
    fs.writeFileSync(this.envFileName, newEnvFile);
  }

  private async setCustomProvider(network: Network, url: string) {
    const customLines = [`${NetworkProviderService.getEnvVarKey(network)}=${url}`];

    const lastLine = fs.readFileSync(this.envFileName).toString().trim().split('\n').slice(-1)[0];
    const isEndingNewLine = lastLine === '\n';
    if (!isEndingNewLine) customLines.unshift('\n');

    fs.appendFileSync('.env', customLines.join(''));
  }

  async run(): Promise<void> {
    const network = await this.promptNetwork();
    const action = await this.promptAction();

    this.deleteLineEnv(network);

    if (action === 'custom') {
      const url = await this.promptNetworkProviderUrl();
      this.setCustomProvider(network, url);
    }
  }
}
