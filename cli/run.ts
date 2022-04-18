import { Command } from '@oclif/core';
import chalk from 'chalk';

import { commands } from './commands';
import { strings } from './strings';

export type CommandRecord = Record<string, typeof Command>;

class CLI extends Command {
  private commands = commands;

  getCommandHelp(cmd: string) {
    return strings.lines([
      chalk.bold(`./studio.sh ${cmd}`),
      `  Description - ${this.commands[cmd].description}`,
      `  Example:`,
      `${this.commands[cmd].examples.map(e => `  ${e}`)}`,
    ]);
  }

  async run(): Promise<void> {
    const cmd = process.argv[2];
    process.argv = process.argv.filter((_, index) => index !== 2);

    if (this.commands[cmd] && process.argv.includes('--help')) {
      this.log(this.getCommandHelp(cmd));
      return;
    }

    if (this.commands[cmd]) {
      await this.commands[cmd].run();
      return;
    }

    this.log(`${chalk.yellow('Command not found')}: "./studio.sh ${cmd} [...]"\n`);

    this.log(`Usage: ./studio.sh ${chalk.bold('[command]')}
    
    ${Object.keys(this.commands)
      .filter(key => !this.commands[key].hidden)
      .map(key => this.getCommandHelp(key))
      .join('\n\n')}`);
  }
}

async function main() {
  try {
    await CLI.run();
  } catch (e) {
    this.error(e.message);
  }
}

main();
