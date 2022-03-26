import { Command } from '@oclif/core';
import chalk from 'chalk';
import HelloCommand from './commands/hello';
import PotatoCommand from './commands/potato';

class Cli extends Command {
  // Add your commands here...
  private commands: Record<string, typeof Command> = {
    hello: HelloCommand,
    potato: PotatoCommand,
  };

  getCommandHelp(cmd: string) {
    return [
      chalk.bold(`./agora.sh ${cmd}`),
      `  Description - ${this.commands[cmd].description}`,
      `  Example:`,
      `${this.commands[cmd].examples.map(e => `  ${e}`)}`,
    ].join('\n');
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

    this.log(`${chalk.yellow('Command not found')}: "./agora.sh ${cmd} [...]"\n`);

    this.log(`Usage: ./agora.sh ${chalk.bold('[command]')}

${Object.keys(this.commands)
  .map(key => this.getCommandHelp(key))
  .join('\n')}
`);
  }
}

async function main() {
  try {
    await Cli.run();
  } catch (e) {
    this.error(e.message);
  }
}

main();
