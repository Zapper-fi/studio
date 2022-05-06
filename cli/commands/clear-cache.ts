/* eslint no-console: 0 */

import { Command } from '@oclif/core';
import chalk from 'chalk';
import rimraf from 'rimraf';

export default class ClearCache extends Command {
  static description = 'Clears the locally persisted cache for app tokens, contract positions, etc.';

  static examples = [`$ ./studio.sh clear-cache`];

  async run(): Promise<void> {
    rimraf('./.cache', () => {
      console.log(chalk.green(`🗑️️  Successfully cleared the local cache`));
    });
  }
}
